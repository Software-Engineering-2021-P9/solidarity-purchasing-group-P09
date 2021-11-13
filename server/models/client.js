"use strict";

class Client {
    constructor(id, email, fullName, address, phoneNumber, wallet) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.wallet = wallet;
    }

    static fromMongoJSON(json) {
        return new Client(json._id, json.email, json.fullName, json.address, json.phoneNumber, json.wallet);
    }
}

module.exports = { Client };
