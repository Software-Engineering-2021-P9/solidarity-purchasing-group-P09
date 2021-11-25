var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dao = require("./dao/dao");

const {
  checkValidationErrorMiddleware,
} = require("./handlers/shared_validators");
var employeeHandlers = require("./handlers/employee");

var orderHandlers = require("./handlers/order");

var clientHandlers = require("./handlers/client");

var productHandlers = require("./handlers/product");


const port = process.env.PORT || 3001;
const buildAPIPath = (apiPath) => "/api" + apiPath;

var app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

dao.open();

// ----------
// /employees
// ----------

app.get(
  buildAPIPath("/employees/:employeeID"),
  employeeHandlers.getEmployeeByIDValidatorChain,
  checkValidationErrorMiddleware,
  employeeHandlers.getEmployeeByIDHandler
);

app.post(
  buildAPIPath("/employees"),
  employeeHandlers.createEmployeeHandlerValidatorChain,
  checkValidationErrorMiddleware,
  employeeHandlers.createEmployeeHandler
);



// --------
// /clients
// --------

app.get(
  buildAPIPath("/clients/:clientID"),
  clientHandlers.getClientByIDValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.getClientByIDHandler
);

app.patch(
  buildAPIPath("/clients/:clientID/wallet"),
  clientHandlers.addFundToWalletValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.addFundToWalletHandler
);

app.get(
  buildAPIPath("/clients"),
  clientHandlers.findClientValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.findClientsHandler
);

app.post(
  buildAPIPath("/clients"),
  clientHandlers.createClientHandlerValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.createClientHandler
);


// ----------
// /orders
// ----------

app.post(
  buildAPIPath("/orders"),
  orderHandlers.createOrderValidatorChain,
  checkValidationErrorMiddleware,
  orderHandlers.createOrderHandler
);

// /products
// ----------
app.get(
  buildAPIPath("/products"),
  productHandlers.getProductsByIDValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.getProductsByIDHandler
);

app.get(
  buildAPIPath("/products/:productID"),
  productHandlers.getProductByIDValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.getProductByIDHandler
);


// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/*", express.static(path.resolve(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;
