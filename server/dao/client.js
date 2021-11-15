"use strict";

const { ObjectID } = require("bson");

const clientCollectionName = "clients";

// ---------------
// GetClientByID
// ---------------

exports.getClientByID = (db, clientID) => {
  return db.collection(clientCollectionName).findOne(ObjectID(clientID));
};

// --------------
// CreateClient
// --------------

exports.createClient = (db, fullName, phoneNumber, email, address, wallet) => {
  return db
    .collection(clientCollectionName)
    .insertOne({ fullName: fullName, phoneNumber: phoneNumber, email: email, address: address, wallet: wallet});
};