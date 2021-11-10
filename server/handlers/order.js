var dao = require("../dao/dao");
const { Order } = require("../models/order");

exports.createOrderHandler = async function (req, res, next) {
  let insertedOrderID;

  var totalPrice = 0;
  var productPrice = 1;
  req.body.products.forEach((product) => {
    totalPrice = totalPrice + product.quantity * productPrice;
  });

  var obj = {
    clientId: req.body.clientId.toString(),
    products: JSON.stringify(req.body.products),
    status: "WAITING",
    totalPrice: totalPrice.toString(),
  };

  await dao
    .createOrder(obj.clientId, obj.products, obj.status, obj.totalPrice)
    .catch((e) => {
      console.error(`CreateOrder() -> couldn't create order: ${e}`);
      res.status(500).end();
    })
    .then((json) => {
      if (!json) {
        console.error(`CreateOrder do not return exactly`);
        res.status(404).end();
      }

      let order = Order.fromMongoJSON(obj);
      res.json(order);
    });
};
