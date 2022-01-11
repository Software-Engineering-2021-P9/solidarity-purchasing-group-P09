var dao = require("../dao/dao");
const { Order } = require("../models/order");
const { ProductAvailability } = require("../models/product_availability");
const {
  ProductAvailabilityResult,
} = require("../models/product_availability_result");
const {
  updateOrdersAfterProductAvailabilityConfirm,
} = require("../services/order_service");
const {
  getNextWeekFarmer,
  getCurrentWeekFarmer,
} = require("../services/weekphase_service/weekphase_service");
const {
  productAvailabilityIDPathValidator,
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityQuantityZeroableBodyValidator,
  availabilityPackagingBodyValidator,
} = require("./shared_validators");
// --------------------------
// GetProductAvailabilityByID
// --------------------------

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

// ------------------------------
// SetNextWeekProductAvailability
// ------------------------------

exports.setNextWeekProductAvailabilityValidatorChain = [
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityPackagingBodyValidator,
];

exports.setNextWeekProductAvailabilityHandler = async function (
  req,
  res,
  next
) {
  let result;

  try {
    result = await dao.getProductByID(req.params.productID);
  } catch (err) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't retrieve the product: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't retrieve the product: Not found`
    );
    return res.status(400).end();
  }

  const farmerID = result.farmerID;
  const [week, year] = getNextWeekFarmer();

  try {
    result = await dao.getProductAvailability(req.params.productID, week, year);
  } catch (err) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: ${err}`
    );
    return res.status(500).end();
  }

  if (result) {
    console.error(
      `SetNextWeekProductAvailability() -> The product availability for the next week is already set`
    );
    return res.status(400).end();
  }

  try {
    await dao.setProductAvailability(
      farmerID,
      req.params.productID,
      week,
      year,
      parseFloat(req.body.price),
      req.body.packaging.toString(),
      parseInt(req.body.quantity)
    );
  } catch (err) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't set the next week product availability: ${err}`
    );
    return res.status(500).end();
  }

  try {
    result = await dao.getProductAvailability(req.params.productID, week, year);
  } catch (err) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(
      `SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: Not found`
    );
    return res.status(404).end();
  }

  return res.json(ProductAvailability.fromMongoJSON(result));
};

// ------------------------------
// GetNextWeekProductAvailability
// ------------------------------

exports.getNextWeekProductAvailabilityValidatorChain = [productIDPathValidator];

exports.getNextWeekProductAvailability = async function (req, res, next) {
  let result;
  try {
    result = await dao.getProductAvailability(
      req.params.productID,
      ...getNextWeekFarmer()
    );
  } catch (err) {
    console.error(
      `GetNextWeekProductAvailability() --> Couldn't retrieve the next week availability: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(
      `GetNextWeekProductAvailability() --> Couldn't retrieve the next week availability: Not found`
    );
    return res.status(404).end();
  }

  return res.json(ProductAvailabilityResult.fromMongoJSON(result));
};

// ---------------------------------
// GetCurrentWeekProductAvailability
// ---------------------------------

exports.getCurrentWeekProductAvailabilityValidatorChain = [
  productIDPathValidator,
];

exports.getCurrentWeekProductAvailability = async function (req, res, next) {
  let result;

  try {
    result = await dao.getProductAvailability(
      req.params.productID,
      ...getCurrentWeekFarmer()
    );
  } catch (err) {
    console.error(
      `GetCurrentWeekProductAvailability() --> Couldn't retrieve the current week availability: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(
      `GetCurrentWeekProductAvailability() --> Couldn't retrieve the current week availability: Not found`
    );
    return res.status(404).end();
  }

  return res.json(ProductAvailabilityResult.fromMongoJSON(result));
};

// -------------------------
// UpdateProductAvailability
// -------------------------

exports.updateProductAvailabilityValidatorChain = [
  productAvailabilityIDPathValidator,
  availabilityQuantityZeroableBodyValidator,
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
