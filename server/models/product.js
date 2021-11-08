"use strict";

class Product {
    
   
    constructor(id, farmerID, name, description, category) {
        
        this.id = id;
        this.farmerID=farmerID;
        this.name = name; 
        this.description = description;
        this.category = category;

    }

    static fromMongoJSON(json) {
        return new Product(json._id, json.farmerID, json.name, json.description, json.category);
    }

}

module.exports = { Product };