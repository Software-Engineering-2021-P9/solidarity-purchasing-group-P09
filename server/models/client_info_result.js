"use strict";

const { UserRoles } = require("./user_roles");

class ClientInfoResult {
  constructor(id, email, fullName, address, phoneNumber, wallet) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.CLIENT;
    this.fullName = fullName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.wallet = wallet;
    this.hasPendingCancelation = false;
  }

  /**
   * @param {boolean} value
   */
  set setHasPendingCancelation(value) {
    this.hasPendingCancelation = value;
  }

  static fromClientInfo(obj) {
    return new ClientInfoResult(
      obj.id,
      obj.email,
      obj.fullName,
      obj.address,
      obj.phoneNumber,
      obj.wallet
    );
  }

  static fromMongoJSON(json) {
    return new ClientInfoResult(
      json._id,
      json.email,
      json.fullName,
      json.address,
      json.phoneNumber,
      json.wallet
    );
  }
}

module.exports = { ClientInfoResult };
