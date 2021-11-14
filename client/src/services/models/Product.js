class Product {
  constructor(id, farmerID, name, description, category) {
    this.id = id;
    this.farmerID = farmerID;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = 1.0;
    this.packaging = "packaging: 1kg";
  }

  static fromJSON(json) {
    const res = new Product(
      json[0].id,
      json[0].farmerID,
      json[0].name,
      json[0].description,
      json[0].category
    );
    return res;
  }
}

export default Product;
