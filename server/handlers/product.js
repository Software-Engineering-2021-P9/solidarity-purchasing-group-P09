var dao = require("../dao/dao");
const { Product } = require("../models/product");
const { ProductAvailability } = require("../models/product_availability");
const { getNextWeekClient } = require("../services/time_service");
const {
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
  productIDPathValidator,
  productCategoryBodyValidator,
  productDescriptionBodyValidator,
  productNameBodyValidator,
  farmerIDBodyValidator,
} = require("./shared_validators");
const {
  ProductAvailabilityResult,
} = require("../models/product_availability_result");

exports.findAvailableProductsValidatorChain = [
  searchStringValidator,
  productCategoryValidator,
];

exports.findAvailableProductsHandler = async function (req, res, next) {
  let productsMongo;
  // Find the available products by the given searchString and category
  try {
    productsMongo = await dao.findProducts(
      req.query.searchString,
      req.query.category
    );
  } catch (err) {
    console.error(`findProducts() -> couldn't retrieve products: ${err}`);
    return res.status(500).end();
  }

  let productsAvailabilitiesMongo;
  try {
    productsAvailabilitiesMongo = await dao.getProductsAvailability(
      productsMongo.map((product) => product._id),
      ...getNextWeekClient()
    );
  } catch (err) {
    console.error(
      `findProducts() -> couldn't retrieve products availabilities: ${err}`
    );
    return res.status(500).end();
  }

  let products = [];
  for (let productAvailabilityMongo of productsAvailabilitiesMongo) {
    let productAvailability = ProductAvailability.fromMongoJSON(
      productAvailabilityMongo
    );

    if (productAvailability.leftQuantity === 0) continue;

    let product = Product.fromMongoJSON(
      productsMongo.find((p) => {
        return p._id.toString() === productAvailability.productID.toString();
      })
    );

    product.availability =
      ProductAvailabilityResult.fromProductAvailability(productAvailability);

    products.push(product);
  }

  return res.json(products);
};

exports.getProductsByIDValidatorChain = [idsValidator];

exports.getProductsByIDHandler = async function (req, res, next) {
  let productsMongo;

  // Retrieve the products associated to the ids in the list
  try {
    productsMongo = await dao.getProductsByIDs(req.query.ids);
  } catch (err) {
    console.error(`getProductsByIDs() -> couldn't retrieve products: ${err}`);
    return res.status(500).end();
  }

  let productsAvailabilitiesMongo;
  try {
    productsAvailabilitiesMongo = await dao.getProductsAvailability(
      productsMongo.map((product) => product._id),
      ...getNextWeekClient()
    );
  } catch (err) {
    console.error(
      `getProductsByIDs() -> couldn't retrieve products availabilities: ${err}`
    );
    return res.status(500).end();
  }

  let products = [];
  for (let productMongo of productsMongo) {
    let product;
    try {
      product = Product.fromMongoJSON(productMongo);
    } catch (err) {
      console.error(
        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
      );
      return res.status(500).end();
    }

    let productAvailabilityMongo = productsAvailabilitiesMongo.find((pa) => {
      return pa.productID.toString() === product.id.toString();
    });

    if (productAvailabilityMongo) {
      let productAvailability = ProductAvailabilityResult.fromMongoJSON(
        productAvailabilityMongo
      );

      product.availability = productAvailability;
    }

    products.push(product);
  }

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
      ...getNextWeekClient()
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
      availability: result
        ? ProductAvailabilityResult.fromMongoJSON(result)
        : null,
    });
  } catch (err) {
    console.error(
      `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(result);
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
      req.body.farmerID.toString(),
      req.body.name.toString(),
      req.body.description.toString(),
      req.body.category.toString()
    );
  } catch (err) {
    console.error(`CreateProduct() -> couldn't create the product: ${err}`);
    return res.status(500).end();
  }

  return res.json({
    id: result.insertedId,
  });
};
