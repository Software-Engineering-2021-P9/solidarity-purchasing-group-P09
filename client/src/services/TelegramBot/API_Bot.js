const axios = require("axios");

exports.findProducts = async function () {
  let urlRequest = "http://localhost:3001/api/products";

  const response = await axios.get(urlRequest);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      return response.data;
    default:
      throw new Error("An error occurred during products fetch");
  }
};

exports.getTelegramUsers = async function () {
  const urlRequest = "http://localhost:3001/api/telegram/users";
  const response = await axios.get(urlRequest);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      return response.data;
    default:
      throw new Error("An error occurred during telegram users fetch");
  }
};

exports.addTelegramUsers = async function (chatID) {
  const urlRequest = "http://localhost:3001/api/telegram/users";
  const response = await axios.post(urlRequest, { chatID: chatID });
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      return response.data;
    default:
      throw new Error("An error occurred during telegram users post");
  }
};
