"use strict";

const { ObjectId } = require("bson");
const { OrderProduct } = require("../models/order");

const orderCollectionName = "orders";

// ------------
// Create Order
// ------------

exports.createOrder = async (
  db,
  clientID,
  products,
  status,
  totalPrice,
  createdAt
) => {
  const mongoProducts = products?.map(
    (p) => new OrderProduct(ObjectId(p.productID), p.quantity)
  );

  const newOrder = {
    clientID: ObjectId(clientID),
    products: mongoProducts,
    status: status,
    totalPrice: totalPrice,
    createdAt: createdAt,
  };

  return db.collection(orderCollectionName).insertOne(newOrder);
};

// ------------
// GetOrderByID
// ------------

exports.getOrderByID = async (db, orderID) => {
  return db.collection(orderCollectionName).findOne(ObjectId(orderID));
};

// -----------
// DeleteOrder
// -----------

exports.deleteOrder = async (db, orderID) => {
  return db.collection(orderCollectionName).deleteOne(ObjectId(orderID));
};
