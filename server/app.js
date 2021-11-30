var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");

var dao = require("./dao/dao");

const {
  checkValidationErrorMiddleware, checkUserRoleMiddleware
} = require("./handlers/shared_validators");
var userHandlers = require("./handlers/user");

var employeeHandlers = require("./handlers/employee");

var clientHandlers = require("./handlers/client");

var orderHandlers = require("./handlers/order");

var productHandlers = require("./handlers/product");

var farmerHandlers = require("./handlers/farmer");

const {
  sessionSettings,
  passportStrategy,
  serializeUser,
  deserializeUser,
} = require("./services/auth_service");
const { UserRoles } = require("./models/user_roles");

const port = process.env.PORT || 3001;
const buildAPIPath = (apiPath) => "/api" + apiPath;

var app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

passport.use(passportStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
app.use(sessionSettings);
app.use(passport.initialize());
app.use(passport.session());

dao.open();

// -------------
// login methods
// -------------

app.post(buildAPIPath("/users/login"), userHandlers.loginHandler(passport));
app.get(buildAPIPath("/users/current"), userHandlers.getCurrentUserHandler);
app.delete(buildAPIPath("/users/current"), userHandlers.logoutHandler);

// ----------
// /employees
// ----------

app.get(
  buildAPIPath("/employees/:employeeID"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE]),
  employeeHandlers.getEmployeeByIDValidatorChain,
  checkValidationErrorMiddleware,
  employeeHandlers.getEmployeeByIDHandler
);

app.post(
  buildAPIPath("/employees"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE]),
  employeeHandlers.createEmployeeHandlerValidatorChain,
  checkValidationErrorMiddleware,
  employeeHandlers.createEmployeeHandler
);

// --------
// /clients
// --------

app.get(
  buildAPIPath("/clients/:clientID"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE, UserRoles.CLIENT]),
  clientHandlers.getClientByIDValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.getClientByIDHandler
);

app.patch(
  buildAPIPath("/clients/:clientID/wallet"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE]),
  clientHandlers.addFundToWalletValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.addFundToWalletHandler
);

app.get(
  buildAPIPath("/clients"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE]),
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
  checkUserRoleMiddleware([UserRoles.EMPLOYEE, UserRoles.CLIENT]),
  orderHandlers.createOrderValidatorChain,
  checkValidationErrorMiddleware,
  orderHandlers.createOrderHandler
);

app.get(
  buildAPIPath("/orders"),
  checkUserRoleMiddleware([UserRoles.EMPLOYEE, UserRoles.CLIENT]),
  orderHandlers.getOrdersByClientIDValidator,
  checkValidationErrorMiddleware,
  orderHandlers.getOrdersByClientID
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
  checkUserRoleMiddleware([UserRoles.FARMER]),
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

// --------
// /farmers
// --------

app.get(
  buildAPIPath("/farmers/:farmerID/products"),
  farmerHandlers.getFarmerProductsValidatorChain,
  checkValidationErrorMiddleware,
  farmerHandlers.getFarmerProductsHandler
);

// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/*", express.static(path.resolve(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;
