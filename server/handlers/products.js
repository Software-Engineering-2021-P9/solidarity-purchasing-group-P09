var dao = require("../dao/dao");
const { Product } = require("../models/product");
const {
    searchStringValidator,
    productCategoryValidator,
    IDsValidator
} = require("./shared_validators");
const { validationResult } = require("express-validator");

exports.getProductsByIDValidatorChain = [searchStringValidator, productCategoryValidator, IDsValidator];

exports.getProductsByIDHandler = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    await dao
        .getProducts(req.body.category
            , req.body.searchString
            , req.body.IDs)
        .catch((e) => {
            console.error(`getProducts() -> couldn't retrieve products: ${e}`);
            res.status(500).end();
        })
        .then((json) => {
          
            const products=json.map((element,index)=> Product.fromMongoJSON(json[index]));
            res.json(products);
        });
};


