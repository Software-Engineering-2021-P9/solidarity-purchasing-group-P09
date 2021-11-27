"use strict";

const { UserRoles } = require("./user_roles");

class EmployeeInfoResult {
  constructor(id, email, fullName) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.EMPLOYEE;
    this.fullName = fullName;
  }

  static fromEmployeeInfo(obj) {
    return new EmployeeInfoResult(obj.id, obj.email, obj.fullName);
  }

  static fromMongoJSON(json) {
    return new EmployeeInfoResult(json._id, json.email, json.fullName);
  }
}

module.exports = { EmployeeInfoResult };
