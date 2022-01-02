const dayjs = require("dayjs");
var dao = require("../dao/dao");
const { ObjectID } = require("bson");
const {
  OrderProduct,
  OrderStatus,
  ShipmentInfo,
  Order,
} = require("../models/order");
const {
  clientIDBodyValidator,
  orderProductIDsBodyValidator,
  orderProductQtysBodyValidator,
  orderProductsBodyValidator,
  orderClientIDQueryValidator,
  orderIDParamValidator,
  orderAddressBodyValidator,
  orderShipmentTypeBodyValidator,
  orderPickUpSlotBodyValidator,
} = require("./shared_validators");

exports.createOrderValidatorChain = [
  clientIDBodyValidator,
  orderProductsBodyValidator,
  orderProductIDsBodyValidator,
  orderProductQtysBodyValidator,
  orderShipmentTypeBodyValidator,
  orderAddressBodyValidator,
  orderPickUpSlotBodyValidator,
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

  //CREATE ORDER
  const order = {
    clientID: ObjectID(req.body.clientID.toString()),
    products: req.body.products?.map(
      (p) =>
        new OrderProduct(ObjectID(p.productID.toString()), parseInt(p.quantity))
    ),
    status: status,
    totalPrice: parseFloat(totalPrice),
    createdAt: dayjs().toISOString(),
    shipmentInfo: new ShipmentInfo(
      req.body.shipmentInfo.type.toString(),
      req.body.shipmentInfo.pickUpSlot?.toString(),
      req.body.shipmentInfo.address.toString()
    ),
  };

  // Insert the new order
  var result;
  try {
    result = await dao.createOrder(order);
  } catch (err) {
    console.error(`CreateOrder() -> couldn't create order: ${err}`);
    return res.status(500).end();
  }

  return res.json({ id: result.insertedId });
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

exports.getOrderByIDValidatorChain = [orderIDParamValidator];

exports.getOrderByID = async function (req, res, next) {
  let result;

  try {
    result = await dao.getOrderByID(req.params.orderID);
  } catch (err) {
    console.error(`getOrderByID() -> couldn't retrieve the order: ${err}`);
    return res.status(500).end();
  }
  if (!result) {
    console.error(`getOrderByID() -> couldn't find the order`);
    return res.status(404).end();
  }

  return res.json(Order.fromMongoJSON(result));
};
