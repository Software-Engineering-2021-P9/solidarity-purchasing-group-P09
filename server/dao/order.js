"use strict";

const orderCollectionName = "orders";

// --------------
// Create Order
// --------------

exports.createOrder = async (db, clientId, products, status, totalPrice) => {
  const newOrder = {
    clientId: clientId,
    products: products,
    status: status,
    totalPrice: totalPrice,
  };
  const res = await db.collection(orderCollectionName).insertOne(newOrder);
  return res.insertedId.toString();
};
