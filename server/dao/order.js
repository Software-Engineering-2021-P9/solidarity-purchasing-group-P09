"use strict";

const { ObjectID } = require("bson");
const { OrderStatus } = require("../models/order");

const orderCollectionName = "orders";

// ------------
// Create Order
// ------------

exports.createOrder = async (db, order) => {
  return db.collection(orderCollectionName).insertOne(order);
};

exports.getOrdersByClientID = async (db, clientID) => {
  return db
    .collection(orderCollectionName)
    .find({ clientID: ObjectID(clientID) })
    .sort({ createdAt: -1 })
    .toArray();
};
// ------------
// GetOrderByID
// ------------

exports.getOrderByID = async (db, orderID) => {
  return db.collection(orderCollectionName).findOne(ObjectID(orderID));
};

// -------------
// CompleteOrder
// -------------

exports.completeOrder = async (db, orderID) => {
  const query = { _id: ObjectID(orderID), status: OrderStatus.PREPARED };
  const update = { $set: { status: OrderStatus.DONE } };
  return db.collection(orderCollectionName).updateOne(query, update);
};

exports.getOrdersByClientIDList = async (db, clientIDList) => {
  const query = { clientID: { $in: clientIDList } };

  return db.collection(orderCollectionName).find(query).toArray();
};
