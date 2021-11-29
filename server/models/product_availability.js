"use strict";

class ProductAvailability {
  constructor(id, farmerID, productID, week, year, packaging, quantity, price) {
    this.id = id;
    this.farmerID = farmerID;
    this.productID = productID;
    this.week = week;
    this.year = year;
    this.packaging = packaging;
    this.quantity = quantity;
    this.price = price;
  }

  static fromMongoJSON(json) {
    return new ProductAvailability(
      json._id,
      json.farmerID,
      json.productID,
      json.week,
      json.year,
      json.packaging,
      json.quantity,
      json.price
    );
  }
}

module.exports = { ProductAvailability };
