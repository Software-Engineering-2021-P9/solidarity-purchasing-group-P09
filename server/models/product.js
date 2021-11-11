"use strict";

class Product {


    constructor(id, farmerID, name, description, category) {

        this.id = id;
        this.farmerID = farmerID;
        this.name = name;
        this.description = description;
        this.category = category;

    }

    static fromMongoJSON(json) {
        return new Product(json._id, json.farmerID, json.name, json.description, json.category);
    }

    static Categories = {
        Fruit: "fruit",
        Vegetables: "vegetables",
        SpreadableCreams: "spreadable creams",
        Meat: "meat",
        Eggs: "eggs",
        Milk: "milk"
    };

}

module.exports = { Product };