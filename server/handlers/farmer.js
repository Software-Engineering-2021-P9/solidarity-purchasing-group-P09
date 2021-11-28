var dao = require("../dao/dao");
const { Product } = require("../models/product");
const { ProductAvailability } = require("../models/product_availability");
const dayjs = require("dayjs");
const { getNextWeek } = require("../services/time_service");
const {
  searchStringValidator,
  productCategoryValidator,
  hasAvailabilitySetValidator,
  farmerIDPathValidator,
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

  try {
    productsAvailabilitiesResult = await dao.getProductsAvailability(
      productsResult.map((product) => product._id),
      ...getNextWeek(dayjs())
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

  let availabilitySet;
  if (req.query.hasAvailabilitySet) {
    req.query.hasAvailabilitySet == "true"
      ? (availabilitySet = true)
      : (availabilitySet = false);
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

  /*
  let listOfAvailableProductIDs = result.map((availability) =>
    availability.productID.toString()
  );

  if (!req.query.hasAvailabilitySet) {
    for (const productID in productsMongoJSON) {
      if (listOfAvailableProductIDs.includes(productID)) {
        try {
          products.push(
            Product.fromMongoJSON({
              ...productsMongoJSON[productID],
              availability: ProductAvailability.fromMongoJSON(
                result.find((el) => el.productID == productID)
              ),
            })
          );
        } catch (err) {
          console.error(
            `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
          );
          return res.status(500).end();
        }
      } else {
        try {
          products.push(
            Product.fromMongoJSON({ ...productsMongoJSON[productID] })
          );
        } catch (err) {
          console.error(
            `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
          );
          return res.status(500).end();
        }
      }
    }

    return res.json(products);
  }

  const availabilitySet =
    req.query.hasAvailabilitySet === "true" ? true : false;
  if (availabilitySet === true) {
    for (const productID in productsMongoJSON) {
      if (listOfAvailableProductIDs.includes(productID)) {
        try {
          products.push(
            Product.fromMongoJSON({
              ...productsMongoJSON[productID],
              availability: ProductAvailability.fromMongoJSON(
                result.find((el) => el.productID == productID)
              ),
            })
          );
        } catch (err) {
          console.error(
            `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
          );
          return res.status(500).end();
        }
      }
    }
  } else {
    for (const productID in productsMongoJSON) {
      if (!listOfAvailableProductIDs.includes(productID)) {
        try {
          products.push(
            Product.fromMongoJSON({ ...productsMongoJSON[productID] })
          );
        } catch (err) {
          console.error(
            `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
          );
          return res.status(500).end();
        }
      }
    }
  }
*/
  return res.json(products);
};
