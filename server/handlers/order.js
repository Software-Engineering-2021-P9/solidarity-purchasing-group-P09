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
const {
  getOrderProductStatusForProductAvailabilityStatus,
  getPriceForShipmentType,
} = require("../services/order_service");

// -----------
// CreateOrder
// -----------

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
  try {
    await dao.runInTransaction(async (session) => {
      // Get products availability for each of the order products
      const orderProducts = req.body.products.map((op) =>
        OrderProduct.fromMongoJSON(op)
      );
      let result;
      try {
        result = await dao.getProductsAvailability(
          orderProducts.map((p) => ObjectID(p.productID)),
          ...getNextWeekClient()
        );
      } catch (err) {
        console.error(
          `CreateOrder() -> couldn't retrieve order products availabilities: ${err}`
        );
        await session.abortTransaction();
        return res.status(500).end();
      }

      let productAvailabilities = result.map((r) =>
        ProductAvailability.fromMongoJSON(r)
      );

      let totalPrice = getPriceForShipmentType(req.body.shipmentInfo.type);

      for (let orderProduct of orderProducts) {
        let productAvailability = productAvailabilities.find(
          (pa) => pa.productID.toString() === orderProduct.productID.toString()
        );

        // Check if product is still available
        if (productAvailability.leftQuantity < orderProduct.quantity) {
          console.error(
            `CreateOrder() -> product availability is lesser than required`
          );
          await session.abortTransaction();
          return res.status(400).end();
        }

        // Update reservedQuantity
        productAvailability.reservedQuantity += orderProduct.quantity;

        // Update order products missing fields
        orderProduct.status = getOrderProductStatusForProductAvailabilityStatus(
          productAvailability.status
        );
        orderProduct.price = productAvailability.price;
        orderProduct.packaging = productAvailability.packaging;

        // Calculate new total
        totalPrice += orderProduct.quantity * orderProduct.price;
      }

      // Update products availabilities
      try {
        await dao.updateProductAvailabilities(productAvailabilities);
      } catch (err) {
        console.error(
          `CreateOrder() -> couldn't update product availabilities: ${err}`
        );
        await session.abortTransaction();
        return res.status(500).end();
      }

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

      let orders;
      try{
        orders = await dao.getOrdersByClientID(req.body.clientID);
      }catch(err){
        console.error(`getOrdersByClientID() -> couldn't retrieve client orders: ${err}`);
        return res.status(500).end(); 
      }

      orders = orders.filter(o => o.status==OrderStatus.WAITING || o.status==OrderStatus.NOTCOVERED);
      let totalOrderCost = 0;
      for(let order of orders){
        totalOrderCost += order.totalPrice;
      }


      //IF WALLET NOT ENOUGH SET THE STATE TO NOT COVERED
      let status;

      if(client.wallet - totalOrderCost < totalPrice)
        status = OrderStatus.NOTCOVERED;
      else
        status = OrderStatus.WAITING;

      // Build new order
      const [week, year] = getNextWeekClient();

      const order = {
        clientID: ObjectID(req.body.clientID.toString()),
        products: orderProducts?.map(
          (op) =>
            new OrderProduct(
              ObjectID(op.productID.toString()),
              op.status,
              op.quantity,
              op.price,
              op.packaging
            )
        ),
        status: status,
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
      try {
        result = await dao.createOrder(order);
      } catch (err) {
        console.error(`CreateOrder() -> couldn't create order: ${err}`);
        await session.abortTransaction();
        return res.status(500).end();
      }

      return res.json({ id: result.insertedId });
    });
  } catch (err) {
    console.error(`CreateOrder() -> Error initializing transaction: ${err}`);
    return res.status(500).end();
  }
};

// -------------------
// GetOrdersByClientID
// -------------------

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

// -------------
// CompleteOrder
// -------------

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

// ------------
// GetOrderByID
// ------------

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
