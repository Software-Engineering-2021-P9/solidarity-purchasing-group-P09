var dao = require("../dao/dao");
const { ObjectID } = require("bson");
const {
  OrderProduct,
  OrderStatus,
  ShipmentInfo,
  Order,
} = require("../models/order");
const { ProductAvailability } = require("../models/product_availability");
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
const { getNextWeekClient, getNowDate } = require("../services/time_service");

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
  const orderProducts = req.body.products.map((op) =>
    OrderProduct.fromMongoJSON(op)
  );

  // Get products for each of the order products
  let result;
  try {
    result = await dao.getProductsAvailability(
      orderProducts.map((p) => new ObjectID(p.productID)),
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

  const [week, year] = getNextWeekClient();
  const order = {
    clientID: ObjectID(req.body.clientID.toString()),
    products: orderProducts?.map(
      (p) =>
        new OrderProduct(
          ObjectID(p.productID.toString()),
          OrderProductStatus.WAITING,
          p.quantity,
          p.price,
          p.packaging
        )
    ),
    status: OrderStatus.WAITING,
    totalPrice: totalPrice,
    createdAt: getNowDate().toISOString(),
    week: week,
    year: year,
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
