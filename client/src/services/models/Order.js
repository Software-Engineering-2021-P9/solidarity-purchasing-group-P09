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
}

export default Order;
