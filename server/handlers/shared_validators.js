const { body, param } = require("express-validator");

exports.employeeIDPathValidator = param("employeeID").isString();
exports.emailBodyValidator = body("email").exists().bail().isEmail();
exports.fullNameBodyValidator = body("fullName")
  .exists()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 35 });
exports.passwordBodyValidator = body("password")
  .exists()
  .bail()
  .isString()
  .bail()
  .isLength({ min: 6 });
