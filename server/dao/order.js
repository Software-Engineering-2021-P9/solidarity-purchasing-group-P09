"use strict";

const { ObjectId } = require("bson");
const {
  OrderProduct,
  OrderStatus,
  OrderProductStatus,
} = require("../models/order");

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
  week,
  year
) => {
  const mongoProducts = products?.map(
    (p) =>
      new OrderProduct(
        ObjectId(p.productID),
        OrderProductStatus.WAITING,
        p.quantity,
        p.price,
        p.packaging
      )
  );

  const newOrder = {
    clientID: ObjectId(clientID),
    products: mongoProducts,
    status: status,
    totalPrice: totalPrice,
    createdAt: createdAt.toISOString(),
    week: week,
    year: year,
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

// -----------
// DeleteOrder
// -----------

exports.deleteOrder = async (db, orderID) => {
  return db.collection(orderCollectionName).deleteOne(ObjectId(orderID));
};

// -------------
// CompleteOrder
// -------------

exports.completeOrder = async (db, orderID) => {
  const query = { _id: ObjectId(orderID), status: OrderStatus.PREPARED };
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
