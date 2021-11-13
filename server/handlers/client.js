var dao = require("../dao/dao");
const { Client } = require("../models/client");
const {
    walletTopUpBodyValidator,
    clientIDPathValidator
} = require("./shared_validators");

exports.getWalletTopUpBodyValidator = [walletTopUpBodyValidator];

exports.topUpWalletHandler = async function (req, res, next) {
    let result;

    try {
        result = await dao.topUpWallet(req.params.clientID, parseFloat(req.body.increaseBy));
    }
    catch (err) {
        console.error(`TopUpWaller() -> couldn't top up wallet: ${err}`);
        return res.status(500).end();
    }

    return result.value === null ? res.status(400).end() : res.json({ newWalletValue: result.value.wallet });

    //javascript says. No I will not enter in this if statement. Byeeee!
    /*
    if (result.value === null) {
        console.error(`TopUpWaller() -> couldn't find client collection or client document: ${err}`);
        return res.status(400).end();
    }
    return res.json({ newWalletValue: result.value.wallet });
    */
}
