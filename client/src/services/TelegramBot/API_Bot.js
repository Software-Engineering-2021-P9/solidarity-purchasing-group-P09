const axios = require("axios");

exports.findProducts = async function (category, searchString) {
  let urlRequest = "http://localhost:3001/api/products";

  const response = await axios.get(urlRequest);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      return response.data;
    default:
      throw new Error("An error occurred during employee fetch");
  }
};
