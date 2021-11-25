"use strict";

class Product {
  constructor(id, farmerID, name, description, category, availability) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(ProductCategory).includes(category))
      this.category = category;
    else throw new Error("Unknown category (" + category + ")");

    if (availability)
      this.availability = availability;
    else
      this.availability = null;
  }

  static fromMongoJSON(json) {
    return new Product(
      json._id,
      json.farmerID,
      json.name,
      json.description,
      json.category,
      json.availability
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
