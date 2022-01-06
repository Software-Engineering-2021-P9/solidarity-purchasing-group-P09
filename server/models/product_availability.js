"use strict";

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
    packaging,
    quantity,
    price,
    reservedQuantity
  ) {
    this.id = id;
    this.farmerID = farmerID;
    this.productID = productID;
    this.week = week;
    this.year = year;
    this.status = status;
    this.packaging = packaging;
    this.quantity = quantity;
    this.price = price;
    this.reservedQuantity = reservedQuantity;
  }

  get leftQuantity() {
    let leftQuantity = this.quantity - this.reservedQuantity;
    return leftQuantity > 0 ? leftQuantity : 0;
  }

  static fromMongoJSON(json) {
    return new ProductAvailability(
      json._id,
      json.farmerID,
      json.productID,
      json.week,
      json.year,
      json.status,
      json.packaging,
      json.quantity,
      json.price,
      json.reservedQuantity
    );
  }
}

module.exports = { ProductAvailability, ProductAvailabilityStatus };
