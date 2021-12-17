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
    leftQuantity
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
    this.leftQuantity = leftQuantity;
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
      json.leftQuantity
    );
  }
}

module.exports = { ProductAvailability, ProductAvailabilityStatus };
