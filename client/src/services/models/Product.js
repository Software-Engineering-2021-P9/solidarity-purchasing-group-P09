import ProductAvailability from "./ProductAvailability";

class Product {
  constructor(id, farmerID, name, description, category, productAvailability) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(Product.Categories).includes(category))
      this.category = category;
    this.productAvailability = productAvailability;
    //Mock price
    this.price = 1.0;
    this.packaging = "packaging: 1kg";
  }

  static fromJSON(json) {
    let productAvailability = null;
    if (json.productAvailability) {
      productAvailability = ProductAvailability.fromJSON(
        json.productAvailability
      );
    }

    return new Product(
      json.id,
      json.farmerID,
      json.name,
      json.description,
      json.category,
      productAvailability
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
