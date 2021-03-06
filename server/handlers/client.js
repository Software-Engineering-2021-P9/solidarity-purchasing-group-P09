var dao = require("../dao/dao");
const { ClientInfoResult } = require("../models/client_info_result");
const { OrderStatus } = require("../models/order");
const { hashPassword } = require("../services/auth_service");

const {
  clientIDPathValidator,
  addFundToWalletBodyValidator,
  searchStringValidator,
  fullNameBodyValidator,
  phoneNumberBodyValidator,
  emailBodyValidator,
  addressBodyValidator,
  passwordBodyValidator,
  hasPendingCancelationValidator,
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

  return res.json(ClientInfoResult.fromMongoJSON(result));
};

exports.addFundToWalletValidatorChain = [
  clientIDPathValidator,
  addFundToWalletBodyValidator,
];
exports.addFundToWalletHandler = async function (req, res, next) {
    let result;
    let orders;
    const clientID = req.params.clientID;

    //TOP UP WALLET
    try {
        result = await dao.addFundToWallet(clientID, parseFloat(req.body.increaseBy));
    }
    catch (err) {
        console.error(`AddFundToWalletHandler() -> couldn't top up wallet: ${err}`);
        return res.status(500).end();
    }
    if (result.value == null) {
        console.error(`AddFundToWalletHandler() -> couldn't find client collection or client document`);
        return res.status(400).end();
    }

    //GET "NOT COVERED" STATUS ORDERS, ORDER THEM FROM OLDER TO NEWER, 
    //AND CHANGE THEM TO "WAITING" STATE IF WALLET AFTER TOP UP IS SUFFICIENT 
    try{
      orders = await dao.getOrdersByClientID(clientID);
    }catch(err){
      console.error(`getOrdersByClientID() -> couldn't retrieve client orders: ${err}`);
      return res.status(500).end(); 
    }

    let waitingOrders = orders.filter(order => order.status == OrderStatus.WAITING);
    let waitingOrdersCost = 0;
    for(let order of waitingOrders){
      waitingOrdersCost += order.totalPrice;
    }

    let notCoveredOrders = orders.filter(order => order.status == OrderStatus.NOTCOVERED).sort((a, b)=>{
        if(a.createdAt <= b.createdAt)
          return -1;
        return 1;
      });
    
    let moneyToCoverOrdersNotCovered = result.value.wallet - waitingOrdersCost;

    for(let order of notCoveredOrders){
      if(moneyToCoverOrdersNotCovered < order.totalPrice)
        break;
        moneyToCoverOrdersNotCovered -= order.totalPrice;
      try{
        await dao.updateOrderStatusToWaiting(order._id);
      }catch(err){
        return res.status(500).end();
      }
    }

    return res.json({ newWalletValue: result.value.wallet});
};

exports.findClientValidatorChain = [
  searchStringValidator,
  hasPendingCancelationValidator,
];
exports.findClientsHandler = async function (req, res, next) {
  let hasPendingCancelation =
    req.query.hasPendingCancelation !== undefined
      ? req.query.hasPendingCancelation === "true"
      : undefined;

  let clientsResult;
  try {
    clientsResult = await dao.findClients(req.query.searchString);
  } catch (err) {
    console.error(`FindClientsHandler() -> couldn't retrieve clients: ${err}`);
    return res.status(500).end();
  }

  const clientIDList = clientsResult.map((client) => client._id);

  let clientsOrdersResult;
  try {
    clientsOrdersResult = await dao.getOrdersByClientIDList(clientIDList);
  } catch (err) {
    console.error(
      `FindClientsHandler() -> couldn't retrieve clients' orders: ${err}`
    );
    return res.status(500).end();
  }

  let clients = [];
  clientsResult.forEach((client) => {
    let hasPendingCancelationResult = clientsOrdersResult
      .filter((order) => order.clientID == client._id.toString())
      .some((order) => order.status === OrderStatus.PENDINGCANCELATION);

    let clientInfo = ClientInfoResult.fromMongoJSON(client);
    clientInfo.setHasPendingCancelation = hasPendingCancelationResult;
    clients.push(clientInfo);
  });

  if (hasPendingCancelation !== undefined) {
    clients = clients.filter(
      (client) => client.hasPendingCancelation === hasPendingCancelation
    );
  }

  return res.json(clients);
};

exports.createClientHandlerValidatorChain = [
  fullNameBodyValidator,
  phoneNumberBodyValidator,
  emailBodyValidator,
  addressBodyValidator,
];

exports.signupClientValidatorChain = [
  fullNameBodyValidator,
  phoneNumberBodyValidator,
  emailBodyValidator,
  passwordBodyValidator,
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
      req.body.address.toString()
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

  return res.json(ClientInfoResult.fromMongoJSON(result));
};

exports.signupClientHandler = async function (req, res, next) {
  // Insert the new client

  let result;
  try {
    result = await dao.signupClient(
      req.body.fullName.toString(),
      req.body.phoneNumber.toString(),
      req.body.email.toString(),
      hashPassword(req.body.password.toString()),
      req.body.address.toString()
    );
  } catch (err) {
    console.error(`CreateClient() -> couldn't create client: ${err}`);
    return res.status(500).end();
  }

  // Fetch the created client
  try {
    result = await dao.getClientByID(result.insertedId);
  } catch (err) {
    return res.status(500).end();
  }

  if (!result) {
    console.error(`CreateClient() -> couldn't retrieve newly created client`);
  }

  return res.json(ClientInfoResult.fromMongoJSON(result));
};
