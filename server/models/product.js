"use strict";

class Product {
  constructor(id, farmerID, name, description, category) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(ProductCategory).includes(category))
      this.category = category;
  }

  static fromMongoJSON(json) {
    return new Product(
      json._id,
      json.farmerID,
      json.name,
      json.description,
      json.category
    );
  }
}

const ProductCategory = {
  FRUIT: "fruit",
  VEGETABLES: "vegetables",
  SPREADABLECREAMS: "spreadable creams",
  MEAT: "meat",
  EGGS: "eggs",
  MILK: "milk",
};

module.exports = { Product, ProductCategory };
