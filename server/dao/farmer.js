"use strict";

const { ObjectID } = require("bson");

const farmerCollectionName = "farmers";

// ---------------
// GetFarmerByID
// ---------------

exports.getFarmerByID = (db, farmerID) => {
  return db.collection(farmerCollectionName).findOne(ObjectID(farmerID));
};

// ----------------
// GetFarmerByEmail
// ----------------

exports.getFarmerByEmail = (db, email) => {
  return db.collection(farmerCollectionName).findOne({ email: email });
};
