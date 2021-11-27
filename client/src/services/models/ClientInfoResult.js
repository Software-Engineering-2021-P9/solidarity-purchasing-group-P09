import UserRoles from "./UserRoles";

class ClientInfoResult {
  constructor(id, email, fullName, address, phoneNumber, wallet) {
    this.id = id;
    this.email = email;
    this.role = UserRoles.CLIENT;
    this.fullName = fullName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.wallet = parseFloat(wallet);
  }

  static fromJSON(json) {
    return new ClientInfoResult(
      json.id,
      json.email,
      json.fullName,
      json.address,
      json.phoneNumber,
      json.wallet
    );
  }
}

export default ClientInfoResult;
