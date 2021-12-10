"use strict";

const OrderStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
  PREPARED: "prepared",
  DONE: "done",
};

class OrderProduct {
  constructor(productID, quantity) {
    this.productID = productID;
    this.quantity = quantity;
  }

  static fromMongoJSON(json) {
    return new OrderProduct(json.productID, json.quantity);
  }
}

class ShipmentInfo {
  constructor(date, time, address, fee) {
    this.date = date;
    this.time = time;
    this.address = address;
    this.fee = fee;
  }

  static fromMongoJSON(json) {
    return new ShipmentInfo(json.date, json.time, json.address, json.fee);
  }
}

class Order {
  constructor(
    id,
    clientID,
    products,
    status,
    totalPrice,
    createdAt,
    shipmentInfo
  ) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.shipmentInfo = shipmentInfo;
  }

  static fromMongoJSON(json) {
    const orderProducts = [];
    json.products?.forEach((orderProductJson) =>
      orderProducts.push(OrderProduct.fromMongoJSON(orderProductJson))
    );
    const shipmentInfo = ShipmentInfo.fromMongoJSON(json.shipmentInfo);
    return new Order(
      json._id,
      json.clientID,
      orderProducts,
      json.status,
      json.totalPrice,
      json.createdAt,
      shipmentInfo
    );
  }
}

module.exports = { Order, OrderProduct, OrderStatus, ShipmentInfo };
