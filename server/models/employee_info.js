"use strict";

const { UserRoles } = require("./user_roles");

class EmployeeInfo {
  constructor(id, email, password, fullName) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = UserRoles.EMPLOYEE;
    this.fullName = fullName;
  }

  static fromMongoJSON(json) {
    return new EmployeeInfo(json._id, json.email, json.password, json.fullName);
  }
}

module.exports = { EmployeeInfo };
