"use strict";

const { OrderStatus } = require("../models/order");
const { ObjectID } = require("bson");

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
    .toArray();
};
// ------------
// GetOrderByID
// ------------

exports.getOrderByID = async (db, orderID) => {
  return db.collection(orderCollectionName).findOne(ObjectID(orderID));
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
  console.log(week, year);
  return db
    .collection(orderCollectionName)
    .find({
      status: OrderStatus.WAITING,
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
    order._id = order.id;
    delete order.id;
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
