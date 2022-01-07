var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");

var dao = require("./dao/dao");

var weekphaseService = require("./services/weekphase_service/weekphase_service");

const {
  checkValidationErrorMiddleware,
} = require("./handlers/shared_validators");

var userHandlers = require("./handlers/user");

var employeeHandlers = require("./handlers/employee");

var clientHandlers = require("./handlers/client");

var orderHandlers = require("./handlers/order");

var productHandlers = require("./handlers/product");

var farmerHandlers = require("./handlers/farmer");

var managerHandlers = require("./handlers/manager");

var weekphaseHandlers = require("./handlers/weekphase");

const {
  sessionSettings,
  passportStrategy,
  serializeUser,
  deserializeUser,
} = require("./services/auth_service");

// ------------
// SERVER SETUP
// ------------
const port = process.env.PORT || 3001;
const buildAPIPath = (apiPath) => "/api" + apiPath;

var app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// ----------
// AUTH SETUP
// ----------
passport.use(passportStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
app.use(sessionSettings);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------
// SERVICES INITIALIZATION
// -----------------------
dao.open();
weekphaseService.init();

// ------------- // login methods // -------------

app.post(buildAPIPath("/users/login"), userHandlers.loginHandler(passport));
app.get(buildAPIPath("/users/current"), userHandlers.getCurrentUserHandler);
app.delete(buildAPIPath("/users/current"), userHandlers.logoutHandler);

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
// managers
// --------

app.get(
  buildAPIPath("/managers/:managerID"),
  managerHandlers.getManagerByIDValidatorChain,
  checkValidationErrorMiddleware,
  managerHandlers.getManagerByIDHandler
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

app.post(
  buildAPIPath("/clients/signup"),
  clientHandlers.signupClientValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.signupClientHandler
);

// ----------
// /orders
// ----------

app.post(
  buildAPIPath("/orders"),
  /*   weekphaseService.checkWeekphaseMiddleware([
    "weekphase-1",
    "weekphase-5",
    "weekphase-6",
    "weekphase-7",
    "weekphase-8",
    "weekphase-9",
  ]), */
  orderHandlers.createOrderValidatorChain,
  checkValidationErrorMiddleware,
  orderHandlers.createOrderHandler
);

app.get(
  buildAPIPath("/orders"),
  orderHandlers.getOrdersByClientIDValidator,
  checkValidationErrorMiddleware,
  orderHandlers.getOrdersByClientID
);

app.patch(
  buildAPIPath("/orders/:orderID/complete"),
  orderHandlers.completeOrderValidatorChain,
  checkValidationErrorMiddleware,
  orderHandlers.completeOrderHandler
);

app.get(
  buildAPIPath("/orders/:orderID"),
  orderHandlers.getOrderByIDValidatorChain,
  checkValidationErrorMiddleware,
  orderHandlers.getOrderByID
);

// ---------
// /products
// ---------

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

app.post(
  buildAPIPath("/products/:productID/availability"),
  productHandlers.setNextWeekProductAvailabilityValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.setNextWeekProductAvailabilityHandler
);

app.get(
  buildAPIPath("/products/:productID/availability/nextWeek"),
  productHandlers.getNextWeekProductAvailabilityValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.getNextWeekProductAvailability
);

app.post(
  buildAPIPath("/products"),
  productHandlers.createProductValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.createProductHandler
);
// --------
// /farmers
// --------

app.get(
  buildAPIPath("/farmers/:farmerID/products"),
  farmerHandlers.getFarmerProductsValidatorChain,
  checkValidationErrorMiddleware,
  farmerHandlers.getFarmerProductsHandler
);

// -----------
// /weekphases
// -----------

app.get(
  buildAPIPath("/weekphases/current"),
  weekphaseHandlers.getCurrentWeekphaseHandler
);

app.patch(
  buildAPIPath("/testing/weekphases/current"),
  weekphaseHandlers.setWeekphaseOverrideValidatorChain,
  checkValidationErrorMiddleware,
  weekphaseHandlers.setWeekphaseOverrideHandler
);

// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/*", express.static(path.resolve(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;
