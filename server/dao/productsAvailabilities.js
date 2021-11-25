"use strict";

const { ObjectID } = require("bson");

const productsAvailabilityCollectionName = "productsAvailability";

exports.getProductsAvailability = (db, listOfIDs, week, year) => {
    const query = {
        $and: [
            { "productID": { "$in": listOfIDs } },
            { "week": week },
            { "year": year }
        ]
    }
    return db.collection(productsAvailabilityCollectionName).find(query).toArray();
}

exports.getProductAvailability = (db, _productID, week, year) => {
    const query = {
        $and: [
            { productID: ObjectID(_productID) },
            { "week": week },
            { "year": year }
        ]
    }
    return db.collection(productsAvailabilityCollectionName).findOne(query);
}