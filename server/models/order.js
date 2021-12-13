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
  constructor(type, pickUpSlot, address) {
    this.type = type;
    this.address = address;
    if (type === "pickup") this.pickUpSlot = pickUpSlot;
  }

  static fromMongoJSON(json) {
    return new ShipmentInfo(json.type, json.pickUpSlot, json.address);
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
