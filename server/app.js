var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var employeeHandlers = require("./handlers/employee");
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

// ----------
// /employees
// ----------

app.get(
  buildAPIPath("/employees/:employeeID"),
  employeeHandlers.getEmployeeByIDValidatorChain,
  employeeHandlers.getEmployeeByIDHandler
);

app.post(
  buildAPIPath("/employees"),
  employeeHandlers.createEmployeeHandlerValidatorChain,
  employeeHandlers.createEmployeeHandler
);

// ----------
// /products
// ----------
app.get(
  buildAPIPath("/products"),
  productHandlers.getProductsByIDValidatorChain,
  productHandlers.getProductsByIDHandler
);

// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/*", express.static(path.resolve(__dirname, "../client/build")));

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;