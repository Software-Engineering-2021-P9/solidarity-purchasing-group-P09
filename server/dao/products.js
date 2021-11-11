"use strict";

const { ObjectID } = require("bson");
const { json } = require("express");

const productsCollectionName = "products";

// ---------------
// GetProducts
// ---------------

exports.getProducts = (db, category, searchString, IDs) => {

  //5 cases: 1IDs is defined, 2Category is defined, 3stringSearch is defined, 
  //4both stringSearch and Category are defined,5 none of them are defined

  //create text index
  db.collection(productsCollectionName).createIndex({ name: "text", description: "text" });
  let query = {};

  if (IDs) {
    query = { _id: { $in: IDs.split(",").map(element => ObjectID(element)) } };
  }

  else if (searchString && category) {
    query = { $and: [{ $text: { $search: searchString.toString() } }, { category: category.toString() }] }

  }


  else if (category) {
    query = { category: category.toString() }
  }

  else if (searchString) {
    query = { $text: { $search: searchString.toString() } };
  }


  return db.collection(productsCollectionName).find(query).toArray();
};


