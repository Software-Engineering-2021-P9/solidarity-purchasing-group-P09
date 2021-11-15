var dao = require("../dao/dao");
const { Client } = require("../models/client");
const {
   clientIDPathValidator,
   fullNameBodyValidator,
   phoneNumberBodyValidator,
    emailBodyValidator,
    addressBodyValidator,
    walletBodyValidator,
  } = require("./shared_validators");
  const { validationResult } = require("express-validator");
  
  exports.getClientByIDValidatorChain = [clientIDPathValidator];
  
  exports.getClientByIDHandler = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }  
  
    await dao
      .getClientByID(req.params.clientID)
      .catch((e) => {
        console.error(`GetClientByID() -> couldn't retrieve client: ${e}`);
        res.status(500).end();
      })
      .then((json) => {
        if (!json) {
          console.error(
            `GetClientByID() -> couldn't retrieve client: not found`
          );
          res.status(404).end();
        }
        let client = Client.fromMongoJSON(json);
        res.json(client);
      });
  };
  
  exports.createClientHandlerValidatorChain = [
    fullNameBodyValidator,
    phoneNumberBodyValidator,
    emailBodyValidator,
    addressBodyValidator,
    walletBodyValidator,
  
  ];
  exports.createClientHandler = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    let insertedClientID;
    await dao
      .createClient(
        req.body.fullName.toString(),
        req.body.phoneNumber.toString(),
        req.body.email.toString(),
        req.body.address.toString(),
        0.0,
      )
      .catch((e) => {
        console.error(`CreateClient() -> couldn't create client: ${e}`);
        res.status(500).end();
      })
      .then((result) => (insertedClientID = result.insertedId));
  
    await dao
      .getClientByID(insertedClientID)
      .catch((e) => {
        console.error(
          `CreateClient() -> couldn't retrieve newly created client: ${e}`
        );
        res.status(500).end();
      })
      .then((json) => {
        if (!json) {
          console.error(
            `CreateClient() -> couldn't retrieve newly created client`
          );
          res.status(404).end();
        }
        let client = Client.fromMongoJSON(json);
        res.json(client);
      });
  };