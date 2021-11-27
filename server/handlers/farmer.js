var dao = require("../dao/dao");
const { Product } = require("../models/product");
const { Availability } = require("../models/Availability");
const dayjs = require("dayjs");
const { getNextWeek } = require("../utils/time");
const {
    searchStringValidator,
    productCategoryValidator,
    hasAvailabilitySetValidator,
    farmerIDPathValidator
} = require("./shared_validators");

exports.getFarmerProductsValidatorChain = [
    searchStringValidator,
    productCategoryValidator,
    hasAvailabilitySetValidator,
    farmerIDPathValidator
]

exports.getFarmerProductsHandler = async function (req, res, next) {
    let result;
    let products = [];

    try {
        result = await dao.findProductsByFarmerID(
            req.params.farmerID,
            req.query.searchString,
            req.query.category
        );
    } catch (err) {
        console.error(`GetFarmerProductsHandler() -> couldn't retrieve products: ${err}`);
        return res.status(500).end();
    }


    const productsMongoJSON = {};
    for (const product of result) {
        productsMongoJSON[product._id] = product;
    }
    const listOfIDs = result.map((product) => product._id);


    try {
        result = await dao.getProductsAvailability(listOfIDs, ...getNextWeek(dayjs()));
    }
    catch (err) {
        console.error(`GetFarmerProductsHandler() -> couldn't retrieve products availabilities: ${err}`);
        return res.status(500).end();
    }

    let listOfAvailableProductIDs = result.map((availability) => availability.productID.toString());


    if (!req.query.hasAvailabilitySet) {

        for (const productID in productsMongoJSON) {
            if (listOfAvailableProductIDs.includes(productID)) {
                try {
                    products.push(Product.fromMongoJSON({ ...productsMongoJSON[productID], availability: Availability.fromMongoJSON(result.find(el => el.productID == productID)) }));
                }
                catch (err) {
                    console.error(
                        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
                    );
                    return res.status(500).end();
                }
            }
            else {
                try {
                    products.push(Product.fromMongoJSON({ ...productsMongoJSON[productID] }));
                }
                catch (err) {
                    console.error(
                        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
                    );
                    return res.status(500).end();
                }
            }
        }

        return res.json(products);
    }

    const availabilitySet = req.query.hasAvailabilitySet === "true" ? true : false
    if (availabilitySet === true) {
        for (const productID in productsMongoJSON) {
            if (listOfAvailableProductIDs.includes(productID)) {
                try {
                    products.push(Product.fromMongoJSON({ ...productsMongoJSON[productID], availability: Availability.fromMongoJSON(result.find(el => el.productID == productID)) }));
                }
                catch (err) {
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
                    products.push(Product.fromMongoJSON({ ...productsMongoJSON[productID] }));
                }
                catch (err) {
                    console.error(
                        `fromMongoJSON() -> couldn't convert Mongo result to Product: ${err}`
                    );
                    return res.status(500).end();
                }
            }
        }
    }

    return res.json(products);
}