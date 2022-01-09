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

  static fromJSON(json) {
    return new Order(
      json.id,
      json.clientID,
      json.products,
      json.status,
      json.totalPrice,
      json.createdAt,
      json.shipmentInfo
    );
  }

  static OrderStatus = {
    NOT_COVERED: "not covered",
    UNRETRIEVED: "unretrieved",
    WAITING: "waiting",
    CONFIRMED: "confirmed",
    PREPARED: "prepared",
    DONE: "done",
    PENDINGCANCELATION: "pending-cancelation",
  };
}

export default Order;
