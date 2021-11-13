"use strict";

const { ObjectID } = require("bson");

const clientCollectionName = "clients";

// -----------
// TopUpWallet
// -----------

exports.topUpWallet = (db, clientID, increaseBy) => {
    console.log("CID:", clientID);
    console.log("INC:", increaseBy);
    var query = { _id: ObjectID(clientID) };
    var update = { $inc: { wallet: increaseBy } };
    return db.collection(clientCollectionName).findOneAndUpdate(query, update, { returnDocument: 'after' });
}
