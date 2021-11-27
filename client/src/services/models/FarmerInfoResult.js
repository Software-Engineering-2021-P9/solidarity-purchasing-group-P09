import UserRoles from "./UserRoles";

class EmployeeInfoResult {
  constructor(id, email, fullName, address) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.FARMER;
    this.fullName = fullName;
    this.address = address;
  }

  static fromJSON(json) {
    return new EmployeeInfoResult(
      json.id,
      json.email,
      json.fullName,
      json.address
    );
  }
}

export default EmployeeInfoResult;
