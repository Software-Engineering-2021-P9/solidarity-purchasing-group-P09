class Order {
  constructor(id, clientID, products, status, totalPrice, createdAt) {
    this.id = id;
    this.clientID = clientID;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
  }

  static fromJSON(json) {
    return new Order(
      json.id,
      json.clientID,
      json.products,
      json.status,
      json.totalPrice,
      json.createdAt
    );
  }

  static OrderStatus = {
    NOT_COVERED: "not covered",
    WAITING: "waiting",
    CONFIRMED: "confirmed",
    PREPARED: "prepared",
    DONE: "done",
  };
}

export default Order;
