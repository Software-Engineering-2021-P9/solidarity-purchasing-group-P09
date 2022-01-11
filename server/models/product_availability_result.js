"use strict";

const { ProductAvailability } = require("./product_availability");

class ProductAvailabilityResult {
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
    return new ProductAvailabilityResult(
      json._id,
      json.farmerID,
      json.productID,
      json.week,
      json.year,
      json.status,
      json.packaging,
      json.quantity,
      json.price,
      json.quantity - json.reservedQuantity
    );
  }

  static fromProductAvailability(obj) {
    return new ProductAvailabilityResult(
      obj.id,
      obj.farmerID,
      obj.productID,
      obj.week,
      obj.year,
      obj.status,
      obj.packaging,
      obj.quantity,
      obj.price,
      obj.leftQuantity
    );
  }
}

module.exports = { ProductAvailabilityResult };
