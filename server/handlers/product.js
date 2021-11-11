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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let products = [];
  if (req.body.ids) {
    await dao
      .getProductsByIDs(req.body.ids)
      .catch((e) => {
        console.error(`getProductsByIDs() -> couldn't retrieve products: ${e}`);
        res.status(500).end();
      })
      .then((json) => {
        products = json;
      });
  } else {
    await dao
      .findProducts(req.body.searchString, req.body.category)
      .catch((e) => {
        console.error(`findProducts() -> couldn't retrieve products: ${e}`);
        res.status(500).end();
      })
      .then((json) => {
        products = json;
      });
  }

  res.json(products.map((element) => Product.fromMongoJSON(element)));
};
