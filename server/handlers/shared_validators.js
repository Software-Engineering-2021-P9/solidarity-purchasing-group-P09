const { body, param, validationResult } = require("express-validator");

exports.checkValidationErrorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.clientIDPathValidator = body("clientId").isMongoId();
exports.productsValidator = body("products").isArray();
exports.productIDPathValidator = body(
  "products.*.productId",
  "productId must be a Mongo ID"
).isMongoId();
exports.productQtyPathValidator = body(
  "products.*.quantity",
  "quantity must be a positive integer"
)
  .notEmpty()
  .isInt({ min: 1, max: 100 });

body().isArray(),
  body("*.user_id", "user_idfield must be a number").isNumeric(),
  body("*.hours", "annotations field must a number").exists().isNumeric(),
  (exports.employeeIDPathValidator = param("employeeID").isMongoId());
exports.emailBodyValidator = body("email")
  .notEmpty()
  .bail()
  .trim()
  .escape()
  .isEmail();
exports.fullNameBodyValidator = body("fullName")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 35 })
  .trim()
  .escape();
exports.passwordBodyValidator = body("password")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ min: 6 })
  .trim()
  .escape();
