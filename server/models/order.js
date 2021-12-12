"use strict";

const OrderStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
  MODIFIED: "modified",
  CANCELED: "canceled",
};

class OrderProduct {
  constructor(productID, quantity, price, packaging, status) {
    this.productID = productID;
    this.quantity = quantity;
    this.price = price;
    this.packaging = packaging;
    this.status = status;
  }

  static fromMongoJSON(json) {
    return new OrderProduct(
      json.productID,
      json.quantity,
      json.price,
      json.packaging,
      json.status
    );
  }
}

class Order {
  constructor(id, clientID, products, status, totalPrice, createdAt) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
  }

  static fromMongoJSON(json) {
    const orderProducts = [];
    json.products?.forEach((orderProductJson) =>
      orderProducts.push(OrderProduct.fromMongoJSON(orderProductJson))
    );

    return new Order(
      json._id,
      json.clientID,
      orderProducts,
      json.status,
      json.totalPrice,
      json.createdAt
    );
  }
}

module.exports = { Order, OrderProduct, OrderStatus };
