const axios = require("axios");

exports.findProducts = async function (base_url) {
  let urlRequest = base_url + "api/products/available?";

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

exports.getTelegramUsers = async function (base_url) {
  const urlRequest = base_url + "api/telegram/users";
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

exports.addTelegramUsers = async function (base_url, chatID) {
  const urlRequest = base_url + "api/telegram/users";
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
