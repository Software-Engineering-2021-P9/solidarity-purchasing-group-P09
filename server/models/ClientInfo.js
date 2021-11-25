"use strict";

class ClientInfo {
  constructor(id, email, password, fullName, address, phoneNumber, wallet) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.wallet = wallet;
  }

  static fromMongoJSON(json) {
    return new ClientInfo(
      json._id,
      json.email,
      json.password,
      json.fullName,
      json.address,
      json.phoneNumber,
      json.wallet
    );
  }
}

module.exports = { ClientInfo };
