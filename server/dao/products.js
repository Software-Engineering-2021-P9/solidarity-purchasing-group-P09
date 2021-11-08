"use strict";

const { ObjectID } = require("bson");
const { json } = require("express");

const productsCollectionName = "products";

// ---------------
// GetProducts
// ---------------

exports.getProducts = (db, category, searchString, IDs) => {

  //5 cases: IDs is defined, Category is defined, stringSearch is defined, 
  //both stringSearch and Category are defined, none of them are defined
  if (IDs) {
    return db.collection(productsCollectionName).find({ _id: { $in: IDs.split(",").map(element => ObjectID(element)) } }).toArray();
  } else if (searchString && category)
    return db.collection(productsCollectionName).find({
      $and: [
        {
          $or: [
            { farmerID: { $regex: searchString } },
            { name: { $regex: searchString } },
            { description: { $regex: searchString } }
          ]
        }, { category: category }]
    }).toArray();
  else if (category)
    return db.collection(productsCollectionName).find({ category: category }).toArray();
  else if (searchString)
    return  db.collection(productsCollectionName).find({
      $or: [
        { farmerID: { $regex: searchString } },
        { name: { $regex: searchString } },
        { description: { $regex: searchString } }
      ]
    }).toArray();

  return db.collection(productsCollectionName).find().toArray();
};


