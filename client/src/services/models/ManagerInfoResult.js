import UserRoles from "./UserRoles";

class ManagerInfoResult {
  constructor(id, email, fullName) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.MANAGER;
    this.fullName = fullName;
  }

  static fromJSON(json) {
    return new ManagerInfoResult(json.id, json.email, json.fullName);
  }
}

export default ManagerInfoResult;
