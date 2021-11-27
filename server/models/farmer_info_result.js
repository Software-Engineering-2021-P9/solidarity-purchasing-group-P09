"use strict";

const { UserRoles } = require("./user_roles");

class FarmerInfoResult {
  constructor(id, email, fullName, address) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.FARMER;
    this.fullName = fullName;
    this.address = address;
  }

  static fromFarmerInfo(obj) {
    return new FarmerInfoResult(obj.id, obj.email, obj.fullName, obj.address);
  }

  static fromMongoJSON(json) {
    return new FarmerInfoResult(
      json._id,
      json.email,
      json.fullName,
      json.address
    );
  }
}

module.exports = { FarmerInfoResult };
