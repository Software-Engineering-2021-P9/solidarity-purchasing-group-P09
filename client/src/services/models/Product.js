import ProductAvailability from "./ProductAvailability";

class Product {
  constructor(id, farmerID, name, description, category, availability) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(Product.Categories).includes(category))
      this.category = category;
    this.availability = availability;
  }

  static fromJSON(json) {
    let availability = null;
    if (json.availability) {
      availability = ProductAvailability.fromJSON(json.availability);
    }

    return new Product(
      json.id,
      json.farmerID,
      json.name,
      json.description,
      json.category,
      availability
    );
  }

  static Categories = {
    Fruit: "fruit",
    Vegetables: "vegetables",
    SpreadableCreams: "spreadable creams",
    Meat: "meat",
    Eggs: "eggs",
    Milk: "milk",
  };
}

export default Product;
