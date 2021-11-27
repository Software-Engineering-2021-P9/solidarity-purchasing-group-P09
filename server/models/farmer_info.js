"use strict";

const { UserRoles } = require("./user_roles");

class FarmerInfo {
  constructor(id, email, password, fullName, address) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = UserRoles.FARMER;
    this.fullName = fullName;
    this.address = address;
  }

  static fromMongoJSON(json) {
    return new FarmerInfo(
      json._id,
      json.email,
      json.password,
      json.fullName,
      json.address
    );
  }
}

module.exports = { FarmerInfo };
