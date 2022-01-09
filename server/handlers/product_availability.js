var dao = require("../dao/dao");
const {
  OrderProductStatus,
  Order,
  OrderStatus,
  ShipmentType,
} = require("../models/order");
const { ProductAvailability } = require("../models/product_availability");
const {
  updateOrdersAfterProductAvailabilityConfirm,
} = require("../services/order_service");
const { getCurrentWeekFarmer } = require("../services/time_service");
const {
  productAvailabilityIDPathValidator,
  availabilityQuantityBodyValidator,
  weekphaseIDBodyValidator,
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
    return res.status(400).end();
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
  try {
    await dao.runInTransaction(async (session) => {
      let result;
      try {
        result = await dao.updateProductAvailability(
          req.params.availabilityID,
          parseInt(req.body.quantity)
        );
      } catch (err) {
        console.error(
          `UpdateProductAvailability() -> couldn't update availability: ${err}`
        );
        await session.abortTransaction();
        return res.status(500).end();
      }

      if (!result.matchedCount) {
        console.error(
          `UpdateProductAvailability() -> couldn't retrieve availability: not found`
        );
        await session.abortTransaction();
        return res.status(400).end();
      }

      return res.status(204).end();
    });
  } catch (err) {
    console.error(
      `UpdateProductAvailability() -> Error initializing transaction: ${err}`
    );
    return res.status(500).end();
  }
};

// --------------------------
// ConfirmProductAvailability
// --------------------------

exports.confirmProductAvailabilityValidatorChain = [
  productAvailabilityIDPathValidator,
];

exports.confirmProductAvailabilityHandler = async function (req, res, next) {
  try {
    await dao.runInTransaction(async (session) => {
      // Update availability status to confirmed
      let result;
      try {
        result = await dao.confirmProductAvailability(
          req.params.availabilityID
        );
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
        result = await dao.getProductAvailabilityByID(
          req.params.availabilityID
        );
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
      orders = updateOrdersAfterProductAvailabilityConfirm(
        productAvailability,
        orders
      );

      // Update all the modified orders
      if (orders.length > 0) {
        try {
          await dao.updateOrders(orders);
        } catch (err) {
          console.error(
            `confirmProductAvailability() -> couldn't update orders: ${err}`
          );
          await session.abortTransaction();
          return res.status(500).end();
        }
      }

      return res.status(204).end();
    });
  } catch (err) {
    console.error(
      `UpdateProductAvailability() -> Error initializing transaction: ${err}`
    );
    return res.status(500).end();
  }
};
