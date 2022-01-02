class ProductAvailability {
  constructor(
    id,
    farmerID,
    productID,
    week,
    year,
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
      json.price,
      json.packaging,
      json.quantity,
      json.leftQuantity
    );
  }
}

export default ProductAvailability;
