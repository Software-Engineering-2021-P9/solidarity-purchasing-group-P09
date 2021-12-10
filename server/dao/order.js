"use strict";

const { ObjectID } = require("bson");
const { OrderProduct, OrderStatus, ShipmentInfo } = require("../models/order");

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
  createdAt,
  date,
  time,
  address,
  fee
) => {
  const mongoProducts = products?.map(
    (p) => new OrderProduct(ObjectID(p.productID.toString()), p.quantity)
  );

  const mongoShipment = new ShipmentInfo(
    date.toString(),
    time.toString(),
    address.toString(),
    fee
  );
  return db.collection(orderCollectionName).insertOne({
    clientID: ObjectID(clientID.toString()),
    products: mongoProducts,
    status: status.toString(),
    totalPrice: totalPrice,
    createdAt: createdAt.toString(),
    shipmentInfo: mongoShipment,
  });
};

exports.getOrdersByClientID = async (db, clientID) => {
  return db
    .collection(orderCollectionName)
    .find({ clientID: ObjectID(clientID) })
    .toArray();
};
// ------------
// GetOrderByID
// ------------

exports.getOrderByID = async (db, orderID) => {
  return db.collection(orderCollectionName).findOne(ObjectID(orderID));
};

// -----------
// DeleteOrder
// -----------

exports.deleteOrder = async (db, orderID) => {
  return db.collection(orderCollectionName).deleteOne(ObjectID(orderID));
};

// -------------
// CompleteOrder
// -------------

exports.completeOrder = async (db, orderID) => {
  const query = { _id: ObjectID(orderID), status: OrderStatus.PREPARED };
  const update = { $set: { status: OrderStatus.DONE } };
  return db.collection(orderCollectionName).updateOne(query, update);
};
