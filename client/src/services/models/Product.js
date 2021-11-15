class Product {
  constructor(id, farmerID, name, description, category) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    if (Object.values(Product.Categories).includes(category))
      this.category = category;

    //Mock price: random value from 1 to 11
    this.price = (Math.random() * 10 + 1).toFixed(2);
  }

  static fromJSON(json) {
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
