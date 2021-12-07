const dayjs = require("dayjs");
var dao = require("../dao/dao");
const { Order, OrderStatus } = require("../models/order");
const {
  clientIDBodyValidator,
  orderProductIDsBodyValidator,
  orderProductQtysBodyValidator,
  orderProductsBodyValidator,
  orderClientIDQueryValidator,
  orderIDParamValidator,
} = require("./shared_validators");

exports.createOrderValidatorChain = [
  clientIDBodyValidator,
  orderProductsBodyValidator,
  orderProductIDsBodyValidator,
  orderProductQtysBodyValidator,
];

exports.createOrderHandler = async function (req, res, next) {
  // productPrice is hardcoded to 1 as a tempoarary solution for now, will be fixed in the next sprints
  const productPrice = 1;

  var totalPrice = 0.0;
  req.body.products.forEach((product) => {
    totalPrice += product.quantity * productPrice;
  });
  
  //GET CLIENT WALLET
  let client;

  try {
    client = await dao.getClientByID(req.body.clientID.toString());
  } catch (err) {
    return res.status(500).end();
  }
  if (!client) {
    console.error(
      `getClientByID() -> couldn't retrieve client`
    );
  }

  //IF WALLET NOT ENOUGH SET THE STATE TO NOT COVERED
  let status;

  if(client.wallet < totalPrice)
    status = OrderStatus.NOT_COVERED;
  else
    status = OrderStatus.WAITING;

  // Insert the new order
  var result;
  try {
    result = await dao.createOrder(
      req.body.clientID.toString(),
      req.body.products,
      status,
      totalPrice,
      dayjs().toISOString()
    );
  } catch (err) {
    console.error(`CreateOrder() -> couldn't create order: ${err}`);
    return res.status(500).end();
  }

  // Fetch the newly created order
  try {
    result = await dao.getOrderByID(result.insertedId);
  } catch (err) {
    // Try reverting the changes made until now, using a best-effort strategy
    dao.deleteOrder(result.insertedId);
    console.error(
      `CreateOrder() -> couldn't retrieve newly created order: ${err}`
    );
    return res.status(500).end();
  }
  if (!result) {
    console.error(`CreateOrder() -> couldn't retrieve newly created order`);
    return res.status(404).end();
  }
  
  return res.json(Order.fromMongoJSON(result));
};

exports.getOrdersByClientIDValidator = [orderClientIDQueryValidator];

exports.getOrdersByClientID = async function (req, res, next) {
  let result;

  try {
    result = await dao.getOrdersByClientID(req.query.clientID);
  } catch (err) {
    console.error(
      `getOrdersByClientID() -> couldn't retrieve client's orders: ${err}`
    );
    return res.status(500).end();
  }

  const orders = result.map((element) => Order.fromMongoJSON(element));
  return res.json(orders);
};

exports.completeOrderValidatorChain = [orderIDParamValidator];

exports.completeOrderHandler = async function (req, res, next) {
  // Insert the new order

  try {
    await dao.completeOrder(req.params.orderID);
  } catch (err) {
    console.error(`CompleteOrder() -> couldn't complete the order: ${err}`);
    return res.status(500).end();
  }

  return res.status(204).end();
};
