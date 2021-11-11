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

  if (IDs) {
    return db.collection(productsCollectionName).find({ _id: { $in: IDs.split(",").map(element => ObjectID(element)) } }).toArray();
  }
  else if (searchString && category)
    return db.collection(productsCollectionName).find({
      $and: [{ $text: { $search: searchString } }, { category: category }]
    }).toArray();

  else if (category)
    return db.collection(productsCollectionName).find({ category: category }).toArray();

  else if (searchString)
    return db.collection(productsCollectionName).find({ $text: { $search: searchString } }).toArray();

  return db.collection(productsCollectionName).find().toArray();
};


