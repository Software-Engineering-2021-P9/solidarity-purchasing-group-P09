var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dao = require("./dao/dao");

const session = require("express-session"); // session middleware
const passport = require("passport");
const passportLocal = require("passport-local");

// initialize and configure passport
passport.use(
  new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication

    db.getUser(username, password)
      .then((user) => {
        if (user) done(null, user);
        else done(null, false, { message: "Username or password wrong" });
      })
      .catch((err) => {
        done(err);
      });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  db.getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

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

// initialize and configure HTTP sessions
app.use(
  session({
    secret: "this and that and other",
    resave: false,
    saveUninitialized: false,
  })
);

// tell passport to use session cookies
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

// login

app.post(
  buildAPIPath("/clients/login"),
  clientHandlers.loginEmailValidatorChain,
  checkValidationErrorMiddleware,
  clientHandlers.getClientByEmailPasswordHandler
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
