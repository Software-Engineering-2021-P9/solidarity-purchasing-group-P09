"use strict";

const { UserRoles } = require("./user_roles");

class ClientInfo {
  constructor(
    id,
    email,
    password,
    fullName,
    address,
    phoneNumber,
    wallet,
    hasPendingCancelation
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = UserRoles.CLIENT;
    this.fullName = fullName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.wallet = wallet;
    this.hasPendingCancelation = hasPendingCancelation;
  }

  static fromMongoJSON(json) {
    return new ClientInfo(
      json._id,
      json.email,
      json.password,
      json.fullName,
      json.address,
      json.phoneNumber,
      json.wallet,
      json.hasPendingCancelation
    );
  }
}

module.exports = { ClientInfo };
