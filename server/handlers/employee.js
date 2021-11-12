var dao = require("../dao/dao");
const { Employee } = require("../models/employee");
const {
  employeeIDPathValidator,
  emailBodyValidator,
  fullNameBodyValidator,
  passwordBodyValidator,
} = require("./shared_validators");

exports.getEmployeeByIDValidatorChain = [employeeIDPathValidator];
exports.getEmployeeByIDHandler = async function (req, res, next) {
  let err;
  let result = await dao
    .getEmployeeByID(req.params.employeeID)
    .catch((e) => (err = e));
  if (err) {
    console.error(`GetEmployeeByID() -> couldn't retrieve employee: ${err}`);
    return res.status(500).end();
  }
  if (!result) {
    console.error(`GetEmployeeByID() -> couldn't retrieve employee: not found`);
    return res.status(404).end();
  }

  return res.json(Employee.fromMongoJSON(result));
};

exports.createEmployeeHandlerValidatorChain = [
  emailBodyValidator,
  passwordBodyValidator,
  fullNameBodyValidator,
];
exports.createEmployeeHandler = async function (req, res, next) {
  let err;
  let result = await dao
    .createEmployee(
      req.body.email.toString(),
      req.body.password.toString(),
      req.body.fullName.toString()
    )
    .catch((e) => (err = e));

  if (err) {
    console.error(`CreateEmployee() -> couldn't create employee: ${err}`);
    return res.status(500).end();
  }

  result = await dao.getEmployeeByID(result.insertedId).catch((e) => (err = e));
  if (err) {
    dao.deleteEmployee(result.insertedId);
    console.error(
      `CreateEmployee() -> couldn't retrieve newly created employee: ${err}`
    );
    return res.status(500).end();
  }
  if (!result) {
    console.error(
      `CreateEmployee() -> couldn't retrieve newly created employee`
    );
    res.status(404).end();
  }

  return res.json(Employee.fromMongoJSON(result));
};
