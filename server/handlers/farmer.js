var dao = require("../dao/dao");
const { Product } = require("../models/product");
const { ProductAvailability } = require("../models/product_availability");
const {
  ProductAvailabilityResult,
} = require("../models/product_availability_result");
const {
  getNextWeekFarmer,
  getCurrentWeekFarmer,
} = require("../services/weekphase_service/weekphase_service");
const {
  searchStringValidator,
  productCategoryValidator,
  hasAvailabilitySetValidator,
  farmerIDPathValidator,
  productIDPathValidator,
  availabilityPriceBodyValidator,
  availabilityQuantityBodyValidator,
  availabilityPackagingBodyValidator,
} = require("./shared_validators");

exports.getFarmerProductsValidatorChain = [
  searchStringValidator,
  productCategoryValidator,
  hasAvailabilitySetValidator,
  farmerIDPathValidator,
];

exports.getFarmerProductsHandler = async function (req, res, next) {
  let productsResult;
  try {
    productsResult = await dao.findProductsByFarmerID(
      req.params.farmerID,
      req.query.searchString,
      req.query.category
    );
  } catch (err) {
    console.error(
      `GetFarmerProductsHandler() -> couldn't retrieve products: ${err}`
    );
    return res.status(500).end();
  }

  let productsAvailabilitiesResult;
  try {
    productsAvailabilitiesResult = await dao.getProductsAvailability(
      productsResult.map((product) => product._id),
      ...getNextWeekFarmer()
    );
  } catch (err) {
    console.error(
      `GetFarmerProductsHandler() -> couldn't retrieve products availabilities: ${err}`
    );
    return res.status(500).end();
  }

  let products = [];

  productsResult.forEach((productResult) => {
    let product = Product.fromMongoJSON(productResult);
    let productAvailability = productsAvailabilitiesResult.find((pa) => {
      return pa.productID == productResult._id.toString();
    });

    if (productAvailability) {
      product.availability =
        ProductAvailability.fromMongoJSON(productAvailability);
    }

    products.push(product);
  });

  let availabilitySet = req.query.hasAvailabilitySet;
  if (availabilitySet === "true") {
    availabilitySet = true;
  } else if (availabilitySet === "false") {
    availabilitySet = false;
  }

  if (availabilitySet === true) {
    products = products.filter((product) => {
      return product.availability !== null;
    });
  } else if (availabilitySet === false) {
    products = products.filter((product) => {
      return product.availability === null;
    });
  }

  return res.json(products);
};
