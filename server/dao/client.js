"use strict";

const { ObjectID } = require("bson");

const clientCollectionName = "clients";

// ---------------
// AddFundToWallet
// ---------------

exports.addFundToWallet = (db, clientID, increaseBy) => {
    var query = { _id: ObjectID(clientID) };
    var update = { $inc: { wallet: increaseBy } };
    return db.collection(clientCollectionName).findOneAndUpdate(query, update, { returnDocument: 'after' });
}

// -------------
// getClientByID
// -------------

exports.getClientByID = (db, clientID) => {
    return db.collection(clientCollectionName).findOne(ObjectID(clientID));
};


// -----------
// FindClients
// -----------

exports.findClients = (db, searchString) => {
    let query;

    if (searchString) {
        query = { $text: { $search: `\"${searchString.toString()}\"` } };
    }

    return db.collection(clientCollectionName).find(query).limit(50).toArray();

};

//Method used for testing
exports.createClientsTextSearchIndexes = (db) => {
    db.collection(clientCollectionName).createIndex({
        email: "text",
        fullName: "text",
        address: "text",
        phoneNumber: "text"
    })
}