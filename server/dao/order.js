"use strict";

const orderCollectionName = "orders";

// --------------
// Create Order
// --------------

exports.createOrder = (db, clientId, products, status, totalPrice) => {
  return db.collection(orderCollectionName).insertOne({
    clientId: clientId,
    products: products,
    status: status,
    totalPrice: totalPrice,
  });
};
