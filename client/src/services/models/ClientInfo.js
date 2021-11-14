class ClientInfo {
  constructor(id, email, password, fullName, address, wallet) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.address = address;
    this.wallet = wallet;
  }

  static fromJSON(json) {
    return new ClientInfo(
      json.id,
      json.email,
      json.password,
      json.fullName,
      json.address,
      json.wallet
    );
  }
}

export default ClientInfo;
