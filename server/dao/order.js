"use strict";

const orderCollectionName = "orders";

// --------------
// Create Order
// --------------

exports.createOrder = async (db, clientId, products, status, totalPrice) => {
  const res = await db.collection(orderCollectionName).insertOne({
    clientId: clientId,
    products: products,
    status: status,
    totalPrice: totalPrice,
  });
  return res.insertedId.toString();
};
