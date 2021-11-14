import eggs from "./images/eggs.jpg";
import fruit from "./images/fruit.jpg";
import creams from "./images/spreadableCreams.jpg";
import meat from "./images/meat.jpg";
import milk from "./images/milk.jpg";
import vegetables from "./images/vegetables.jpg";
import Product from "../models/Product";

class ImageService {
  static returnImageByCategory(category) {
    let toReturn;
    switch (category) {
      case Product.Categories.Eggs:
        toReturn = eggs;
        break;
      case Product.Categories.Milk:
        toReturn = milk;
        break;

      case Product.Categories.Meat:
        toReturn = meat;
        break;

      case Product.Categories.SpreadableCreams:
        toReturn = creams;
        break;

      case Product.Categories.Fruit:
        toReturn = fruit;
        break;

      case Product.Categories.Vegetables:
        toReturn = vegetables;
        break;
      default:
        console.log("No images for: " + category);
    }

    return toReturn;
  }
}

export default ImageService;
