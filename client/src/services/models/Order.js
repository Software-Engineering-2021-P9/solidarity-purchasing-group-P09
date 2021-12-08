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

  static fromJSON(json) {
    return new Order(
      json.id,
      json.clientID,
      json.products,
      json.status,
      json.totalPrice,
      json.createdAt,
      json.deliveryType,
    );
  }

  static OrderStatus = {
    NOT_COVERED: "not covered",
    WAITING: "waiting",
    CONFIRMED: "confirmed",
    PREPARED: "prepared",
    DONE: "done",
  };

  static DeliveryType = {
    SHIPMENT: "shipment",
    PICKUP: "pickup",
  }
}

export default Order;
