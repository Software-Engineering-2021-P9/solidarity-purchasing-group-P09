"use strict";

const { UserRoles } = require("./user_roles");

class ManagerInfoResult {
  constructor(id, email, fullName) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.MANAGER;
    this.fullName = fullName;
  }

  static fromManagerInfo(obj) {
    return new ManagerInfoResult(obj.id, obj.email, obj.fullName);
  }

  static fromMongoJSON(json) {
    return new ManagerInfoResult(json._id, json.email, json.fullName);
  }
}

module.exports = { ManagerInfoResult };
