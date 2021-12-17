var dao = require("../dao/dao");
const { OrderProductStatus, Order, OrderStatus } = require("../models/order");
const { ProductAvailability } = require("../models/product_availability");
const { getCurrentWeekFarmer } = require("../services/time_service");
const {
  productAvailabilityIDPathValidator,
  availabilityQuantityBodyValidator,
} = require("./shared_validators");

// ----------------------
// GetProductAvailability
// ----------------------

exports.getProductAvailabilityByIDValidatorChain = [
  productAvailabilityIDPathValidator,
];

exports.getProductAvailabilityByIDHandler = async function (req, res, next) {
  let result;
  try {
    result = await dao.getProductAvailabilityByID(req.params.availabilityID);
  } catch (err) {
    console.error(
      `getProductAvailabilityByID() -> couldn't retrieve availability: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(
      `getProductAvailabilityByID() -> couldn't retrieve availability: not found`
    );
    return res.status(404).end();
  }

  return res.json(ProductAvailability.fromMongoJSON(result));
};

// -------------------------
// UpdateProductAvailability
// -------------------------

exports.updateProductAvailabilityValidatorChain = [
  productAvailabilityIDPathValidator,
  availabilityQuantityBodyValidator,
];

exports.updateProductAvailabilityHandler = async function (req, res, next) {
  let result;
  try {
    result = await dao.updateProductAvailability(
      req.params.availabilityID,
      req.body.quantity
    );
  } catch (err) {
    console.error(
      `updateProductAvailability() -> couldn't update availability: ${err}`
    );
    return res.status(500).end();
  }

  if (!result.matchedCount) {
    console.error(
      `updateProductAvailability() -> couldn't retrieve availability: not found`
    );
    return res.status(400).end();
  }

  return res.status(204).end();
};

// --------------------------
// ConfirmProductAvailability
// --------------------------

exports.confirmProductAvailabilityValidatorChain = [
  productAvailabilityIDPathValidator,
];

exports.confirmProductAvailabilityHandler = async function (req, res, next) {
  await dao.runInTransaction(async (session) => {
    // Update availability status to confirmed
    let result;
    try {
      result = await dao.confirmProductAvailability(req.params.availabilityID);
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't confirm availability: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    // If the request is not associated to an existing product availability, return an error
    if (!result.matchedCount) {
      console.error(
        `confirmProductAvailability() -> couldn't retrieve availability: not found`
      );
      await session.abortTransaction();
      return res.status(400).end();
    }

    // Retrieve confirmed product availability
    try {
      result = await dao.getProductAvailabilityByID(req.params.availabilityID);
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't retrieve availability: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    let productAvailability = ProductAvailability.fromMongoJSON(result);

    // Retrieve all the orders containing the product in ascending order by creation date,
    // for the current farmer week
    let orders = [];
    try {
      result = await dao.getOrdersContainingProducts(
        productAvailability.productID,
        ...getCurrentWeekFarmer(),
        1
      );
      orders = result.map((r) => Order.fromMongoJSON(r));
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't retrieve orders to update: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    // Update all the orders' products.
    // The orders are confirmed following the creation order.
    let leftQuantity = productAvailability.quantity;
    for (let order of orders) {
      for (let orderProduct of order.products) {
        if (
          orderProduct.productID.toString() !==
          productAvailability.productID.toString()
        ) {
          continue;
        }

        // If the order product quantity can be fullfilled by the availability, set it as confirmed.
        if (leftQuantity - orderProduct.quantity > 0) {
          orderProduct.status = OrderProductStatus.CONFIRMED;
          leftQuantity -= orderProduct.quantity;
          // Else, if the order product quantity can be only partially fullfilled,
          // modify its quantity to match the availability and set it's state as modified.
        } else if (
          leftQuantity - orderProduct.quantity < 0 &&
          leftQuantity > 0
        ) {
          orderProduct.status = OrderProductStatus.MODIFIED;
          orderProduct.quantity = leftQuantity;
          leftQuantity = 0;
          // Else, if the order product cannot be fullfilled by the availability, set it as canceled.
        } else {
          orderProduct.status = OrderProductStatus.CANCELED;
          orderProduct.quantity = 0;
          continue;
        }
      }

      // Calculate new order total price
      order.totalPrice = order.products
        .map((op) => op.quantity * op.price)
        .reduce((a, b) => a + b);

      // If all products are canceled, set the order as canceled
      if (
        order.products.filter((op) => op.status === OrderProductStatus.CANCELED)
          .length === order.products.length
      ) {
        order.status = OrderStatus.CANCELED;
      }
    }

    // Update all the modified orders
    try {
      result = await dao.updateOrders(orders);
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't update orders: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    return res.status(204).end();
  });
};
