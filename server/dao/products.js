"use strict";

const { ObjectID } = require("bson");
const { productsCollection } = require("../test/test-data");

const productsCollectionName = "products";

// ---------------
// GetProducts
// ---------------

exports.getProductsByIDs = (db, ids) => {
  const query = {
    _id: { $in: ids.split(",").map((element) => ObjectID(element)) },
  };

  return db.collection(productsCollectionName).find(query).toArray();
};

exports.findProducts = (db, searchString, category) => {
  //4 cases: 1. Category is defined, 2. stringSearch is defined,
  //3.both stringSearch and Category are defined, 4. none of them are defined

  let query = {};

  if (searchString && category) {
    query = {
      $and: [
        { $text: { $search: searchString.toString() } },
        { category: category.toString() },
      ],
    };
  } else if (category) {
    query = { category: category.toString() };
  } else if (searchString) {
    query = { $text: { $search: searchString.toString() } };
  }
  return db.collection(productsCollectionName).find(query).toArray();
};

exports.getProductByID = (db, productID) => {

  return db.collection(productsCollectionName).findOne({ _id: ObjectID(productID) });
};

//Method used for testing
exports.createProductsTextSearchIndexes = (db) => {
  //create text index
  db.collection(productsCollectionName).createIndex({
    name: "text",
    description: "text",
  });
};