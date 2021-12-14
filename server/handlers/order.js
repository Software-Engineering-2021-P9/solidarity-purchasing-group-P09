const { ObjectId } = require("bson");
const dayjs = require("dayjs");
var dao = require("../dao/dao");
const { Order, OrderStatus, OrderProduct } = require("../models/order");
const { Product } = require("../models/product");
const { ProductAvailability } = require("../models/product_availability");
const { getNextWeekClient, getNowDate } = require("../services/time_service");
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
  const orderProducts = req.body.products.map((op) =>
    OrderProduct.fromMongoJSON(op)
  );

  // Get products for each of the order products
  let result;
  try {
    result = await dao.getProductsAvailability(
      orderProducts.map((p) => new ObjectId(p.productID)),
      ...getNextWeekClient()
    );
  } catch (err) {
    console.error(
      `CreateOrder() -> couldn't retrieve order products availabilities: ${err}`
    );
    return res.status(500).end();
  }
  let productsAvailabilities = result.map((r) =>
    ProductAvailability.fromMongoJSON(r)
  );

  var totalPrice = 0.0;
  for (let orderProduct of orderProducts) {
    const productAvailability = productsAvailabilities.find(
      (pa) => pa.productID.toString() === orderProduct.productID.toString()
    );
    orderProduct.price = productAvailability.price;
    orderProduct.packaging = productAvailability.packaging;
    totalPrice += orderProduct.quantity * orderProduct.price;
  }

  // Insert the new order
  try {
    result = await dao.createOrder(
      req.body.clientID.toString(),
      orderProducts,
      OrderStatus.WAITING,
      totalPrice,
      getNowDate(),
      ...getNextWeekClient()
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
