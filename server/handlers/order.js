var dao = require("../dao/dao");
const { ObjectID } = require("bson");
const {
  OrderProduct,
  OrderStatus,
  ShipmentInfo,
  Order,
  OrderProductStatus,
} = require("../models/order");
const {
  ProductAvailability,
  ProductAvailabilityStatus,
} = require("../models/product_availability");
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
  await dao.runInTransaction(async (session) => {
    // Get products availability for each of the order products
    const orderProducts = req.body.products.map((op) =>
      OrderProduct.fromMongoJSON(op)
    );
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
      await session.abortTransaction();
      return res.status(500).end();
    }

    let productAvailabilities = result.map((r) =>
      ProductAvailability.fromMongoJSON(r)
    );

    let totalPrice = 0.0;
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

      // Update leftQuantity
      productAvailability.leftQuantity -= orderProduct.quantity;

      // Update order products missing fields
      orderProduct.status =
        productAvailability.status === ProductAvailabilityStatus.CONFIRMED
          ? OrderProductStatus.CONFIRMED
          : OrderProductStatus.WAITING;
      orderProduct.price = productAvailability.price;
      orderProduct.packaging = productAvailability.packaging;

      // Calculate new total
      totalPrice += orderProduct.quantity * orderProduct.price;
    }

    // Update products availabilities
    try {
      result = await dao.updateProductAvailabilities(productAvailabilities);
    } catch (err) {
      console.error(
        `CreateOrder() -> couldn't update product availabilities: ${err}`
      );
      await session.abortTransaction();
      return res.status(500).end();
    }

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
    try {
      result = await dao.createOrder(order);
    } catch (err) {
      console.error(`CreateOrder() -> couldn't create order: ${err}`);
      await session.abortTransaction();
      return res.status(500).end();
    }

    return res.json({ id: result.insertedId });
  });
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
