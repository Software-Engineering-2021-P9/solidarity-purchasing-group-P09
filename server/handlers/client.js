var dao = require("../dao/dao");
const { ClientInfo } = require("../models/ClientInfo");
const {
    clientIDPathValidator,
    addFundToWalletBodyValidator,
    searchStringValidator
} = require("./shared_validators");


exports.getclientIDPathValidator = [clientIDPathValidator];
exports.getClientByIDHandler = async function (req, res, next) {
    let result;

    try {
        result = await dao.getClientByID(req.params.clientID);
    }
    catch (err) {
        console.error(`getClientByIDHandler() -> couldn't retrieve the client: ${err}`);
        return res.status(500).end();
    }

    if (!result) {
        console.error(`getClientByIDHandler() -> client not found`);
        return res.status(404).end();
    }

    return res.json(ClientInfo.fromMongoJSON(result));
}

exports.getAddFundToWalletBodyValidator = [addFundToWalletBodyValidator];
exports.addFundToWalletHandler = async function (req, res, next) {
    let result;

    try {
        result = await dao.addFundToWallet(req.params.clientID, parseFloat(req.body.increaseBy));
    }
    catch (err) {
        console.error(`addFundToWalletHandler() -> couldn't top up wallet: ${err}`);
        return res.status(500).end();
    }

    if (result.value == null) {
        console.error(`addFundToWalletHandler() -> couldn't find client collection or client document`);
        return res.status(400).end();
    }
    return res.json({ newWalletValue: result.value.wallet });

}

exports.getSearchStringValidator = [searchStringValidator];
exports.findClientsHandler = async function (req, res, next) {
    let result;

    try {
        result = await dao.findClients(req.query.searchString);
    }
    catch (err) {
        console.error(`FindClientsHandler() -> couldn't find clients: ${err}`);
        return res.status(500).end();
    }

    if (!result) {
        return res.status(204).end();
    }

    return res.json(result.map((clientMongoJSON) => ClientInfo.fromMongoJSON(clientMongoJSON)));
}