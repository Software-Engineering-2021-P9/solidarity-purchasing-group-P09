"use strict";

const { ObjectID } = require("bson");

const managerCollectionName = "managers";

// ---------------
// GetmanagerByID
// ---------------

exports.getManagerByID = (db, managerID) => {
  return db.collection(managerCollectionName).findOne(ObjectID(managerID));
};

// ----------------
// GetManagerByEmail
// ----------------

exports.getManagerByEmail = (db, email) => {
  return db.collection(managerCollectionName).findOne({ email: email });
};
