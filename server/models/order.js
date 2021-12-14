"use strict";

const OrderProductStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
  MODIFIED: "modified",
  CANCELED: "canceled",
};

class OrderProduct {
  constructor(productID, status, quantity, price, packaging) {
    this.productID = productID;
    this.status = status;
    this.quantity = quantity;
    this.price = price;
    this.packaging = packaging;
  }

  static fromMongoJSON(json) {
    return new OrderProduct(
      json.productID,
      json.status,
      json.quantity,
      json.price,
      json.packaging
    );
  }
}

const OrderStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
  PREPARED: "prepared",
  DONE: "done",
  CANCELED: "canceled",
};

class Order {
  constructor(
    id,
    clientID,
    products,
    status,
    totalPrice,
    createdAt,
    week,
    year
  ) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.week = week;
    this.year = year;
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
      json.createdAt,
      json.week,
      json.year
    );
  }
}

module.exports = { Order, OrderProduct, OrderStatus, OrderProductStatus };
