"use strict";

class Employee {
  constructor(id, email, password, fullName) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }

  static fromMongoJSON(json) {
    return new Employee(json._id, json.email, json.password, json.fullName);
  }
}

module.exports = { Employee };
