var dao = require("../dao/dao");
const {
  OrderProductStatus,
  Order,
  OrderStatus,
  OrderProduct,
} = require("../models/order");
const { ProductAvailability } = require("../models/product_availability");
const { getCurrentWeekFarmer } = require("../services/time_service");
const {
  productAvailabilityIDPathValidator,
  availabilityQuantityBodyValidator,
} = require("./shared_validators");

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

exports.confirmProductAvailabilityValidatorChain = [
  productAvailabilityIDPathValidator,
];

exports.confirmProductAvailabilityHandler = async function (req, res, next) {
  await dao.runInTransaction(async (session) => {
    let result;
    // Update availability status to confirmed
    try {
      result = await dao.confirmProductAvailability(req.params.availabilityID);
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't confirm availability: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    if (!result.matchedCount) {
      console.error(
        `confirmProductAvailability() -> couldn't retrieve availability: not found`
      );
      await session.abortTransaction();
      return res.status(400).end();
    }

    // Obtain confirmed product availability
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

    let leftQuantity = productAvailability.quantity;
    for (let order of orders) {
      for (let orderProduct of order.products) {
        if (
          orderProduct.productID.toString() !==
          productAvailability.productID.toString()
        ) {
          continue;
        }

        if (leftQuantity - orderProduct.quantity > 0) {
          orderProduct.status = OrderProductStatus.CONFIRMED;
          leftQuantity -= orderProduct.quantity;
        } else if (
          leftQuantity - orderProduct.quantity < 0 &&
          leftQuantity > 0
        ) {
          orderProduct.status = OrderProductStatus.MODIFIED;
          orderProduct.quantity = leftQuantity;
          leftQuantity = 0;
        } else {
          orderProduct.status = OrderProductStatus.CANCELED;
          orderProduct.quantity = 0;
          continue;
        }
      }

      // Calculate new order total
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

    // Batch update orders
    try {
      result = await dao.updateOrders(orders);
    } catch (err) {
      console.error(
        `confirmProductAvailability() -> couldn't update orders: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

    // Decrease the availability leftquantity counter for each iterated orderproduct
    // if leftquantity - op quantity > 0 CONFIRM
    // else if leftquantity - op quantity < 0 && leftquantity > 0 MODIFY
    // else CANCEL
    // if orderproduct leftquantity-quantity < 0 && leftquantity > 0
    // lq: 10 -> op1:3 -> op2:4 -> op3:5 ->op4:2  --> op1 CONF, op2 CONF, op3 MOD, op4 CANC
  });

  return res.status(204).end();
};
