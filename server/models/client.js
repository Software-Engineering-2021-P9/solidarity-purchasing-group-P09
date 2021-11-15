"use strict";

class Client {
  constructor(id, fullName, phoneNumber, email,  address, wallet) {
    this.id = id;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.wallet = wallet;
  }

  static fromMongoJSON(json) {
    return new Client(json._id, json.fullName, json.phoneNumber, json.email,  json.address, json.wallet);
  }
}

module.exports = { Client };