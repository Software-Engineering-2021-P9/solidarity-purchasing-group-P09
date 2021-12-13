
 const dayjs = require("dayjs");
 var dao = require("../dao/dao");
 const { ObjectID } = require("bson");
 const {
   OrderProduct,
   OrderStatus,
   ShipmentInfo,
   Order,
 } = require("../models/order");
 
 const { getProductPrice } = require("../dao/productAvailability");
 const { getNextWeek } = require("../services/time_service");
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
  const [week, year] = getNextWeek(dayjs());
  var totalPrice = 0.0;

  for (const p of req.body.products) {
    var productPrice = await dao.getProductPrice(
      p.productID,
      ...getNextWeek(dayjs())
    );
    totalPrice += p.quantity * productPrice;
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
else{
  return res.json(Order.fromMongoJSON(result));
}
 };

 exports.getOrdersByClientIDValidator = [orderClientIDQueryValidator];
 exports.completeOrderHandler = async function (req, res, next) {
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
 