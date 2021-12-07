var dao = require("../dao/dao");
const dayjs = require("dayjs");
const { Product } = require("../models/product");
const { ProductAvailability } = require("../models/product_availability");
const { getNextWeek, getCurrentWeek } = require("../services/time_service");
const {
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityPackagingBodyValidator,
  productCategoryBodyValidator,
  productDescriptionBodyValidator,
  productNameBodyValidator,
  farmerIDBodyValidator,
} = require("./shared_validators");
const { ObjectID } = require("bson");

exports.getProductsByIDValidatorChain = [
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
];

exports.getProductsByIDHandler = async function (req, res, next) {
  // If the ids query parameter is set, retrieve the products associated to the ids in the list
  let productsResult;
  let products = [];

  if (req.query.ids) {
    try {
      productsResult = await dao.getProductsByIDs(req.query.ids);
    } catch (err) {
      console.error(`getProductsByIDs() -> couldn't retrieve products: ${err}`);
      return res.status(500).end();
    }

    try {
      products = productsResult.map((product) =>
        Product.fromMongoJSON({ ...product })
      );
    } catch (err) {
      console.error(
        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
      );

      return res.status(500).end();
    }

    return res.json(products);
  }

  // Else, find the available products by the given searchString and category

  try {
    productsResult = await dao.findProducts(
      req.query.searchString,
      req.query.category
    );
  } catch (err) {
    console.error(`findProducts() -> couldn't retrieve products: ${err}`);
    return res.status(500).end();
  }

  let productsAvailabilitiesResult;
  try {
    productsAvailabilitiesResult = await dao.getProductsAvailability(
      productsResult.map((product) => product._id),
      ...getNextWeek(dayjs())
    );
  } catch (err) {
    console.error(
      `findProducts() -> couldn't retrieve products availabilities: ${err}`
    );
    return res.status(500).end();
  }

  productsAvailabilitiesResult.forEach((productAvailability) => {
    let product = Product.fromMongoJSON(
      productsResult.find((p) => {
        return p._id == productAvailability.productID.toString();
      })
    );

    product.availability =
      ProductAvailability.fromMongoJSON(productAvailability);
    products.push(product);
  });

  return res.json(products);
};

exports.getProductByIDValidatorChain = [productIDPathValidator];

exports.getProductByIDHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.getProductByID(req.params.productID);
  } catch (err) {
    console.error(`GetProductByID() -> couldn't retrieve the product: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`GetProductByID() -> couldn't retrieve product: not found`);
    return res.status(404).end();
  }

  let productMongoJSON = result;

  try {
    result = await dao.getProductAvailability(
      req.params.productID,
      ...getCurrentWeek(dayjs())
    );
  } catch (err) {
    console.error(
      `GetProductByID() -> couldn't retrieve product availability: ${err}`
    );
    return res.status(500).end();
  }

  try {
    result = Product.fromMongoJSON({
      ...productMongoJSON,
      availability: result,
    });
  } catch (err) {
    console.error(
      `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(result);
};

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
  const [week, year] = getNextWeek(dayjs());

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

exports.getNextWeekProductAvailabilityValidatorChain = [productIDPathValidator];

exports.getNextWeekProductAvailability = async function (req, res, next) {
  let result;

  try {
    result = await dao.getProductAvailability(
      req.params.productID,
      ...getNextWeek(dayjs())
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

  return res.json(ProductAvailability.fromMongoJSON(result));
};

exports.createProductValidatorChain = [
  farmerIDBodyValidator,
  productNameBodyValidator,
  productDescriptionBodyValidator,
  productCategoryBodyValidator,
];
exports.createProductHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.createProduct(
      req.body.farmerID,
      req.body.name,
      req.body.description,
      req.body.category
    );
  } catch (err) {
    console.error(`CreateProduct() -> couldn't create the product: ${err}`);
    return res.status(500).end();
  }

  try {
    result = Product.fromMongoJSON({ productMongoJSON });
  } catch (err) {
    console.error(
      `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(result);
};
