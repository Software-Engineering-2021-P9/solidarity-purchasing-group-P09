"use strict";

const { UserRoles } = require("./user_roles");

class ManagerInfo {
  constructor(id, email, password, fullName) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = UserRoles.MANAGER;
    this.fullName = fullName;
  }

  static fromMongoJSON(json) {
    return new ManagerInfo(json._id, json.email, json.password, json.fullName);
  }
}

module.exports = { ManagerInfo };
