var dao = require("../dao/dao");
const { Order } = require("../models/order");
const { validationResult } = require("express-validator");
const {
  clientIDPathValidator,
  productIDPathValidator,
  productQtyPathValidator,
  productsValidator,
} = require("./shared_validators");

exports.createOrderValidatorChain = [
  clientIDPathValidator,
  productsValidator,
  productIDPathValidator,
  productQtyPathValidator,
];

exports.createOrderHandler = async function (req, res, next) {
  // Insert the new order

  // productPrice is hardcoded to 1 as a tempoarary solution for now, will be fixed in the next sprints

  var result;
  var totalPrice = 0;
  var productPrice = 1;

  var isNegativeQuantity = false;
  req.body.products.forEach((product) => {
    totalPrice = totalPrice + product.quantity * productPrice;
    if (product.quantity < 0) {
      isNegativeQuantity = true;
    }
  });

  if (isNegativeQuantity) {
    console.error(`Negative Quantity is found: ${err}`);
    return res.status(400).end();
  }
  var obj = {
    clientId: req.body.clientId.toString(),
    products: req.body.products,
    status: "WAITING",
    totalPrice: totalPrice.toString(),
  };
  try {
    result = await dao.createOrder(
      obj.clientId,
      obj.products,
      obj.status,
      obj.totalPrice
    );
  } catch (err) {
    console.error(`CreateOrder() -> couldn't create order: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`CreateOrder() -> couldn't retrieve newly created order`);
    return res.status(404).end();
  }
  obj._id = result;
  //console.log(Order.fromMongoJSON(obj));
  res.json(Order.fromMongoJSON(obj));
};
