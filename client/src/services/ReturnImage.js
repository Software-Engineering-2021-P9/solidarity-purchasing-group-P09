import eggs from "../assets/eggs.jpg";
import fruit from "../assets/fruit.jpg";
import creams from "../assets/spreadableCreams.jpg";
import meat from "../assets/meat.jpg";
import milk from "../assets/milk.jpg";
import vegetables from "../assets/vegetables.jpg";
import Product from "./models/Product";

const returnImage = (category) => {
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
};

export default returnImage;
