const dayjs = require("dayjs");
var dao = require("../dao/dao");
const { Order, OrderStatus } = require("../models/order");
const { UserRoles } = require("../models/user_roles");
const {
  clientIDBodyValidator,
  orderProductIDsBodyValidator,
  orderProductQtysBodyValidator,
  orderProductsBodyValidator,
  orderClientIDQueryValidator,
} = require("./shared_validators");
const configOverrideAuth = require ("../services/overrideAuth");
const overrideAuth = require("../services/overrideAuth");

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

  // checking if the req.body.clientID is the same of the logged client
  if(configOverrideAuth.overrideAuth){
    console.log("OverrideAuth set to true");
  }
  else if(req.user.role === UserRoles.CLIENT && req.body.clientID != req.user.id){
    return res.status(401).end();
  }

  // Insert the new order
  var result;
  try {
    result = await dao.createOrder(
      req.body.clientID.toString(),
      req.body.products,
      OrderStatus.WAITING,
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
