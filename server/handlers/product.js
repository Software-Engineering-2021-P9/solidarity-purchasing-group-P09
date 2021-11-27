var dao = require("../dao/dao");
const dayjs = require("dayjs");
const { Product } = require("../models/product");
const { Availability } = require("../models/Availability");
const { getNextWeek } = require("../utils/time");
const {
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityPackagingBodyValidator
} = require("./shared_validators");

exports.getProductsByIDValidatorChain = [
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
];

exports.getProductsByIDHandler = async function (req, res, next) {
  let result;
  let products = [];

  if (req.query.ids) {
    try {
      result = await dao.getProductsByIDs(req.query.ids);
    } catch (err) {
      console.error(`getProductsByIDs() -> couldn't retrieve products: ${err}`);
      return res.status(500).end();
    }
  } else {
    try {
      result = await dao.findProducts(
        req.query.searchString,
        req.query.category
      );
    } catch (err) {
      console.error(`findProducts() -> couldn't retrieve products: ${err}`);
      return res.status(500).end();
    }
  }

  if (req.query.ids) {
    try {
      products = result.map((product) => Product.fromMongoJSON({ ...product }));
    }
    catch (err) {
      console.error(
        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
      );
      return res.status(500).end();
    }
  }
  else {
    const productsMongoJSON = {};
    for (const product of result) {
      productsMongoJSON[product._id] = product;
    }

    const listOfIDs = result.map((product) => product._id);

    try {
      result = await dao.getProductsAvailability(listOfIDs, ...getNextWeek(dayjs()));
    }
    catch (err) {
      console.error(`findProducts() -> couldn't retrieve products availabilities: ${err}`);
      return res.status(500).end();
    }

    result.forEach((availability) => {
      try {
        products.push(Product.fromMongoJSON({ ...productsMongoJSON[availability.productID], availability: Availability.fromMongoJSON(availability) }));
      }
      catch (err) {
        console.error(
          `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
        );
        return res.status(500).end();
      }
    });
  }

  return res.json(products);
};


exports.getProductByIDValidatorChain = [
  productIDPathValidator
];

exports.getProductByIDHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.getProductByID(req.params.productID);
  }
  catch (err) {
    console.error(`GetProductByID() -> couldn't retrieve the product: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`GetProductByID() -> couldn't retrieve product: not found`);
    return res.status(404).end();
  }

  let productMongoJSON = result;

  try {
    result = await dao.getProductAvailability(req.params.productID, ...getNextWeek(dayjs()));
  }
  catch (err) {
    console.error(`GetProductByID() -> couldn't retrieve product availability: ${err}`);
    return res.status(500).end();
  }

  try {
    result = Product.fromMongoJSON({ ...productMongoJSON, availability: result })
  }
  catch (err) {
    console.error(
      `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(result);
}


exports.setNextWeekProductAvailabilityValidatorChain = [
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityPackagingBodyValidator
];

exports.setNextWeekProductAvailabilityHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.getProductByID(req.params.productID);
  }
  catch (err) {
    console.error(`SetNextWeekProductAvailability() -> couldn't retrieve the product: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`SetNextWeekProductAvailability() -> couldn't retrieve the product: Not found`);
    return res.status(400).end();
  }

  const farmerID = result.farmerID;
  const [week, year] = getNextWeek(dayjs());

  try {
    result = await dao.getProductAvailability(req.params.productID, week, year);
  }
  catch (err) {
    console.error(`SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: ${err}`);
    return res.status(500).end();
  }

  if (result) {
    console.error(`SetNextWeekProductAvailability() -> The product availability for the next week is already set`);
    return res.status(400).end();
  }

  try {
    result = await dao.setProductAvailability(farmerID, req.params.productID, week, year, req.body.price, req.body.packaging, req.body.quantity);
  }
  catch (err) {
    console.error(`SetNextWeekProductAvailability() -> couldn't set the next week product availability: ${err}`);
    return res.status(500).end();
  }

  try {
    result = await dao.getProductAvailability(req.params.productID, week, year);
  }
  catch (err) {
    console.error(`SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`SetNextWeekProductAvailability() -> couldn't retrieve the newly created product availability: Not found`);
    return res.status(404).end();
  }

  return res.json(Availability.fromMongoJSON(result));
}