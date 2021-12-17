"use strict";

const { ObjectID } = require("bson");
const { ProductAvailabilityStatus } = require("../models/product_availability");

const productsAvailabilityCollectionName = "availabilities";

// --------------------------
// GetProductAvailabilityByID
// --------------------------

exports.getProductAvailabilityByID = (db, availabilityID) => {
  return db
    .collection(productsAvailabilityCollectionName)
    .findOne(ObjectID(availabilityID));
};

// -----------------------
// GetProductsAvailability
// -----------------------

exports.getProductsAvailability = (db, listOfIDs, week, year) => {
  const query = {
    $and: [{ productID: { $in: listOfIDs } }, { week: week }, { year: year }],
  };

  console.log(listOfIDs);
  return db
    .collection(productsAvailabilityCollectionName)
    .find(query)
    .toArray();
};

// ----------------------
// GetProductAvailability
// ----------------------

exports.getProductAvailability = (db, productID, week, year) => {
  const query = {
    $and: [{ productID: ObjectID(productID) }, { week: week }, { year: year }],
  };
  return db.collection(productsAvailabilityCollectionName).findOne(query);
};

// -----------------------
// SetProductsAvailability
// -----------------------

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
    status: ProductAvailabilityStatus.WAITING,
    price: price,
    packaging: packaging,
    quantity: quantity,
  });
};

// -------------------------
// UpdateProductAvailability
// -------------------------

exports.updateProductAvailability = (db, availabilityID, quantity) => {
  return db.collection(productsAvailabilityCollectionName).updateOne(
    {
      _id: ObjectID(availabilityID),
      status: ProductAvailabilityStatus.WAITING,
    },
    { $set: { quantity: quantity } }
  );
};

// --------------------------
// ConfirmProductAvailability
// --------------------------
exports.confirmProductAvailability = (db, availabilityID) => {
  return db.collection(productsAvailabilityCollectionName).updateOne(
    {
      _id: ObjectID(availabilityID),
      status: ProductAvailabilityStatus.WAITING,
    },
    { $set: { status: ProductAvailabilityStatus.CONFIRMED } }
  );
};

// ---------------------------
// UpdateProductAvailabilities
// ---------------------------

exports.updateProductAvailabilities = (db, productAvailabilities) => {
  const bulkData = productAvailabilities.map((pa) => {
    if (!pa._id) {
      pa._id = pa.id;
      delete pa.id;
    }
    return {
      replaceOne: {
        upsert: false,
        filter: {
          _id: pa._id,
        },
        replacement: pa,
      },
    };
  });
  return db.collection(productsAvailabilityCollectionName).bulkWrite(bulkData);
};
