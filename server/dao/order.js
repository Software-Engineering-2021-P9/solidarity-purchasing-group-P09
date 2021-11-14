"use strict";

const orderCollectionName = "orders";

// --------------
// Create Order
// --------------

exports.createOrder = async (db, clientID, products, status, totalPrice) => {
  const newOrder = {
    clientID: clientID.toString(),
    products: products.toString(),
    status: status.toString(),
    totalPrice: totalPrice.toString(),
  };
  const res = await db.collection(orderCollectionName).insertOne(newOrder);
  return res.insertedId.toString();
};
