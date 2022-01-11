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

// -----------
// UpdateOrderStatus
// -----------

exports.updateOrderStatusToWaiting = (db, orderID) => {
  var query = { _id: ObjectID(orderID) };
  var update = { $set: { status: OrderStatus.WAITING } };
  return db
    .collection(orderCollectionName)
    .updateOne(query, update, { returnDocument: "after" });
};
// --------------------------
// GetOrdersContainingProduct
// --------------------------

exports.getOrdersContainingProducts = (
  db,
  productID,
  week,
  year,
  sortByCreation
) => {
  return db
    .collection(orderCollectionName)
    .find({
      $or: [
        { status: OrderStatus.WAITING },
        { status: OrderStatus.NOTCOVERED },
      ],
      week: week,
      year: year,
      "products.productID": productID,
    })
    .sort({ createdAt: sortByCreation })
    .toArray();
};

// -------------
// CompleteOrder
// -------------

exports.completeOrder = async (db, orderID) => {
  const query = { _id: ObjectID(orderID), status: OrderStatus.PREPARED };
  const update = { $set: { status: OrderStatus.DONE } };
  return db.collection(orderCollectionName).updateOne(query, update);
};

// ------------
// UpdateOrders
// ------------

exports.updateOrders = async (db, orders) => {
  const bulkData = orders.map((order) => {
    if (!order._id) {
      order._id = order.id;
      delete order.id;
    }
    return {
      replaceOne: {
        upsert: false,
        filter: {
          _id: order._id,
        },
        replacement: order,
      },
    };
  });
  return db.collection(orderCollectionName).bulkWrite(bulkData);
};

// -----------------------
// GetOrdersByClientIDList
// -----------------------

exports.getOrdersByClientIDList = async (db, clientIDList) => {
  const query = { clientID: { $in: clientIDList } };

  return db.collection(orderCollectionName).find(query).toArray();
};

exports.setPreparedOrdersToUnretrieved = async (db, week, year) => {
  const query = {
    $and: [{ week: week }, { year: year }, { status: OrderStatus.PREPARED }],
  };
  const data = { $set: { status: OrderStatus.UNRETRIEVED } };

  return db.collection(orderCollectionName).updateMany(query, data);
};
