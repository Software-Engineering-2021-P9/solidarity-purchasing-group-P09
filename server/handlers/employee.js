var dao = require("../dao/dao");
const { Employee } = require("../models/employee");
const {
  employeeIDPathValidator,
  emailBodyValidator,
  fullNameBodyValidator,
  passwordBodyValidator,
} = require("./shared_validators");
const {validationResult} = require("express-validator");

exports.getEmployeeByIDValidatorChain = [employeeIDPathValidator];
exports.getEmployeeByIDHandler = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await dao
    .getEmployeeByID(req.params.employeeID)
    .catch((e) => {
      console.error(`GetEmployeeByID() -> couldn't retrieve employee: ${e}`);
      res.status(500).end();
    })
    .then((json) => {
      if (!json) {
        console.error(
          `GetEmployeeByID() -> couldn't retrieve employee: not found`
        );
        res.status(404).end();
      }
      let employee = Employee.fromMongoJSON(json);
      res.json(employee);
    });
};

exports.createEmployeeHandlerValidatorChain = [
  emailBodyValidator,
  passwordBodyValidator,
  fullNameBodyValidator,
];
exports.createEmployeeHandler = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let insertedEmployeeID;
  await dao
    .createEmployee(req.body.email, req.body.password, req.body.fullName)
    .catch((e) => {
      console.error(`CreateEmployee() -> couldn't create employee: ${e}`);
      res.status(500).end();
    })
    .then((result) => (insertedEmployeeID = result.insertedId));

  await dao
    .getEmployeeByID(insertedEmployeeID)
    .catch((e) => {
      console.error(
        `CreateEmployee() -> couldn't retrieve newly created employee: ${e}`
      );
      res.status(500).end();
    })
    .then((json) => {
      if (!json) {
        console.error(
          `CreateEmployee() -> couldn't retrieve newly created employee`
        );
        res.status(404).end();
      }
      let employee = Employee.fromMongoJSON(json);
      res.json(employee);
    });
};
