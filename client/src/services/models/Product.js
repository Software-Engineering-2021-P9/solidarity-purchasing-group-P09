class Product {
  constructor(id, farmerID, name, description, category) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(Product.Categories).includes(category))
      this.category = category;
  }

  static fromMongoJSON(json) {
    return new Product(
      json.id,
      json.farmerID,
      json.name,
      json.description,
      json.category
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
