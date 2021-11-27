var dao = require("../dao/dao");
const { ClientInfo } = require("../models/client_info");
const {
  clientIDPathValidator,
  addFundToWalletBodyValidator,
  searchStringValidator,
  fullNameBodyValidator,
  phoneNumberBodyValidator,
  emailBodyValidator,
  addressBodyValidator
} = require("./shared_validators");

exports.getClientByIDValidatorChain = [clientIDPathValidator];
exports.getClientByIDHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.getClientByID(req.params.clientID);
  } catch (err) {
    console.error(
      `GetClientByIDHandler() -> couldn't retrieve the client: ${err}`
    );
    return res.status(500).end();
  }

  if (!result) {
    console.error(`GetClientByIDHandler() -> client not found`);
    return res.status(404).end();
  }

  return res.json(ClientInfo.fromMongoJSON(result));
};

exports.addFundToWalletValidatorChain = [
  clientIDPathValidator,
  addFundToWalletBodyValidator,
];
exports.addFundToWalletHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.addFundToWallet(
      req.params.clientID,
      parseFloat(req.body.increaseBy)
    );
  } catch (err) {
    console.error(`AddFundToWalletHandler() -> couldn't top up wallet: ${err}`);
    return res.status(500).end();
  }

  if (result.value == null) {
    console.error(
      `AddFundToWalletHandler() -> couldn't find client collection or client document`
    );
    return res.status(400).end();
  }
  return res.json({ newWalletValue: result.value.wallet });
};

exports.findClientValidatorChain = [searchStringValidator];
exports.findClientsHandler = async function (req, res, next) {
  let result;

  try {
    result = await dao.findClients(req.query.searchString);
  } catch (err) {
    console.error(`FindClientsHandler() -> couldn't find clients: ${err}`);
    return res.status(500).end();
  }

  return res.json(
    result.map((clientMongoJSON) => ClientInfo.fromMongoJSON(clientMongoJSON))
  );
};

exports.createClientHandlerValidatorChain = [
  fullNameBodyValidator,
  phoneNumberBodyValidator,
  emailBodyValidator,
  addressBodyValidator,
];

exports.createClientHandler = async function (req, res, next) {
  // Insert the new client
  let result;
  try {
    result = await dao.createClient(
      req.body.fullName.toString(),
      req.body.phoneNumber.toString(),
      req.body.email.toString(),
      req.body.address.toString(),
      0.0
    );
  } catch (err) {
    console.error(`CreateClient() -> couldn't create client: ${err}`);
    return res.status(500).end();
  }

  // Fetch the newly created client
  try {
    result = await dao.getClientByID(result.insertedId);
  } catch (err) {
    return res.status(500).end();
  }

  if (!result) {
    console.error(`CreateClient() -> couldn't retrieve newly created client`);
  }

  return res.json(ClientInfo.fromMongoJSON(result));
};
