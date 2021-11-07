var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexHandlers = require("./handlers/index");
var employeeHandlers = require("./handlers/employee");

const port = process.env.PORT || 3001;
const requestPath = (path) => "/api" + path;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Serve client app
app.use("/", express.static(path.resolve(__dirname, "../client/build")));

app.get(requestPath("/"), indexHandlers.indexHandler);

// ----------
// /employees
// ----------

app.get(
  requestPath("/employees/:employeeID"),
  employeeHandlers.getEmployeeByIDValidatorChain,
  employeeHandlers.getEmployeeByIDHandler
);

app.post(
  requestPath("/employees"),
  employeeHandlers.createEmployeeHandlerValidatorChain,
  employeeHandlers.createEmployeeHandler
);

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

module.exports = app;
