"use strict";

const { ObjectID } = require("bson");

const productsAvailabilityCollectionName = "availabilities";

exports.getProductsAvailability = (db, listOfIDs, week, year) => {
  const query = {
    $and: [{ productID: { $in: listOfIDs } }, { week: week }, { year: year }],
  };

  return db
    .collection(productsAvailabilityCollectionName)
    .find(query)
    .toArray();
};

exports.getProductAvailability = (db, productID, week, year) => {
  const query = {
    $and: [{ productID: ObjectID(productID) }, { week: week }, { year: year }],
  };
  return db.collection(productsAvailabilityCollectionName).findOne(query);
};

exports.setProductAvailability = (
  db,
  farmerID,
  productID,
  week,
  year,
  price,
  packaging,
  quantity
) => {
  return db.collection(productsAvailabilityCollectionName).insertOne({
    farmerID: ObjectID(farmerID),
    productID: ObjectID(productID),
    week: week,
    year: year,
    price: price,
    packaging: packaging,
    quantity: quantity,
  });
};

exports.getProductPrice = (db, productID) => {
  return db.collection(productsAvailabilityCollectionName).findOne({"productID": {"$eq":productID}}, {"price":1});
}; 

