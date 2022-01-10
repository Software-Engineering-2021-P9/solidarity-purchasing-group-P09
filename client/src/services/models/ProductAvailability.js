const ProductAvailabilityStatus = {
  WAITING: "waiting",
  CONFIRMED: "confirmed",
};

class ProductAvailability {
  constructor(
    id,
    farmerID,
    productID,
    week,
    year,
    status,
    price,
    packaging,
    quantity,
    leftQuantity
  ) {
    this.id = id;
    this.farmerID = farmerID;
    this.productID = productID;
    this.week = week;
    this.year = year;
    this.status = status;
    this.price = price;
    this.packaging = packaging;
    this.quantity = quantity;
    this.leftQuantity = leftQuantity;
  }

  static fromJSON(json) {
    return new ProductAvailability(
      json.id,
      json.farmerID,
      json.productID,
      json.week,
      json.year,
      json.status,
      json.price,
      json.packaging,
      json.quantity,
      json.leftQuantity
    );
  }
}

export { ProductAvailability as default, ProductAvailabilityStatus };
