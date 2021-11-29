"use strict";

const { ObjectId } = require("bson");
const { OrderProduct, OrderStatus } = require("../models/order");

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

exports.getOrdersByClientID = async (db, clientID) => {
  return db
    .collection(orderCollectionName)
    .find({ clientID: ObjectId(clientID) })
    .toArray();
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

// -----------
// UpdateOrderStatus
// -----------

exports.updateOrderStatusToWaiting = (db, orderID) => {
  var query = { _id: ObjectId(orderID) };
  var update = { $set: {status: OrderStatus.WAITING} };
  return db.collection(orderCollectionName).updateOne(query, update, { returnDocument: 'after' });
}