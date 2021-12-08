"use strict";

const OrderStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
  PREPARED: "prepared",
  DONE: "done",
};

const DeliveryType = {
  SHIPMENT: "shipment",
  PICKUP: "pickup",
}

class OrderProduct {
  constructor(productID, quantity) {
    this.productID = productID;
    this.quantity = quantity;
  }

  static fromMongoJSON(json) {
    return new OrderProduct(json.productID, json.quantity);
  }
}

class Order {
  constructor(id, clientID, products, status, totalPrice, createdAt, deliveryType) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.deliveryType = deliveryType;
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
      json.deliveryType,
    );
  }
}

module.exports = { Order, OrderProduct, OrderStatus };
