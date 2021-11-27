import UserRoles from "./UserRoles";

class FarmerInfoResult {
  constructor(id, email, fullName, address) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.FARMER;
    this.fullName = fullName;
    this.address = address;
  }

  static fromJSON(json) {
    return new FarmerInfoResult(
      json.id,
      json.email,
      json.fullName,
      json.address
    );
  }
}

export default FarmerInfoResult;
