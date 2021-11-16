class ClientInfo {
  constructor(id, email, fullName, address, wallet) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.address = address;
    this.wallet = parseFloat(wallet);
  }

  static fromJSON(json) {
    return new ClientInfo(
      json.id,
      json.email,
      json.fullName,
      json.address,
      json.wallet
    );
  }
}

export default ClientInfo;
