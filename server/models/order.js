"use strict";

const OrderProductStatus = {
  WAITING: "waiting",
  NOTCOVERED: "not-covered",
  PENDINGCANCELATION: "pending-cancelation",
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
    week,
    year,
    shipmentInfo
  ) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.week = week;
    this.year = year;
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
      json.week,
      json.year,
      shipmentInfo
    );
  }
}

module.exports = {
  Order,
  OrderProduct,
  OrderStatus,
  ShipmentInfo,
  OrderProductStatus,
};
