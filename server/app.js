var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
var dao = require("./dao/dao");

const {
  checkValidationErrorMiddleware,
} = require("./handlers/shared_validators");
var employeeHandlers = require("./handlers/employee");

var orderHandlers = require("./handlers/order");

var clientHandlers = require("./handlers/client");

var productHandlers = require("./handlers/product");

passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  dao
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "not authenticated" });
};

const port = process.env.PORT || 3001;
const buildAPIPath = (apiPath) => "/api" + apiPath;

var app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(
  session({
    secret: "bla bla bla",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
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

// login

app.post(buildAPIPath("/clients/login"), clientHandlers.loginHandler);
app.get(
  buildAPIPath("/clients/session"),
  clientHandlers.currentLoggedInClientHandler
);

app.delete(buildAPIPath("/clients/session"), clientHandlers.logoutHandler);

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

app.get(
  buildAPIPath("/orders"),
  orderHandlers.getOrdersByClientIDValidator,
  checkValidationErrorMiddleware,
  orderHandlers.getOrdersByClientID
);

// /products
// ----------
app.get(
  buildAPIPath("/products"),
  productHandlers.getProductsByIDValidatorChain,
  checkValidationErrorMiddleware,
  productHandlers.getProductsByIDHandler
);

// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/*", express.static(path.resolve(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;
