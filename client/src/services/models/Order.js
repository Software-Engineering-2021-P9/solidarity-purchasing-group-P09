class Order {
  constructor(id, clientId, products, status, totalPrice) {
    this.id = id;
    this.clientId = clientId;
    this.products = products;
    this.status = status;
    this.totalPrice = totalPrice;
  }

  static fromJSON(json) {
    return new Order(
      json._id,
      json.clientId,
      json.products,
      json.status,
      json.totalPrice
    );
  }
}

export default Order;
