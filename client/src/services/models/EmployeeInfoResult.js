import UserRoles from "./UserRoles";

class EmployeeInfoResult {
  constructor(id, email, fullName) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.EMPLOYEE;
    this.fullName = fullName;
  }

  static fromJSON(json) {
    return new EmployeeInfoResult(json.id, json.email, json.fullName);
  }
}

export default EmployeeInfoResult;
