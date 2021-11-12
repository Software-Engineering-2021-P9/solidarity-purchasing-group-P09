var dao = require("../dao/dao");
const { Product } = require("../models/product");
const {
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
} = require("./shared_validators");
const { validationResult } = require("express-validator");

exports.getProductsByIDValidatorChain = [
  searchStringValidator,
  productCategoryValidator,
  idsValidator,
];

exports.getProductsByIDHandler = async function (req, res, next) {
  let result;
  if (req.body.ids) {
    try {
      result = await dao.getProductsByIDs(req.body.ids);
    } catch (err) {
      console.error(`getProductsByIDs() -> couldn't retrieve products: ${err}`);
      return res.status(500).end();
    }
  } else {
    try {
      result = await dao.findProducts(req.body.searchString, req.body.category);
    } catch (err) {
      console.error(`findProducts() -> couldn't retrieve products: ${err}`);
      return res.status(500).end();
    }
  }

  let products = [];
  try {
    products = result.map((element) => Product.fromMongoJSON(element));
  } catch (err) {
    console.error(
      `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(products);
};
