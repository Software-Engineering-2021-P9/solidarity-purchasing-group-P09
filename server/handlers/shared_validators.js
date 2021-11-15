const { ObjectId } = require("bson");
const { ProductCategory } = require("../models/product");
const { body, param, validationResult, query } = require("express-validator");

exports.checkValidationErrorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.employeeIDPathValidator = param("employeeID").isMongoId();
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

//products

exports.productCategoryValidator = query("category")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isIn(Object.values(ProductCategory));

exports.searchStringValidator = query("searchString")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .escape();

exports.idsValidator = query("ids")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .custom((value) => {
    const splittedIDs = value.split(",");
    return (
      splittedIDs.length ==
      splittedIDs.filter((id) => ObjectId.isValid(id)).length
    );
  })
  .escape();


    //Clients


    exports.clientIDPathValidator = param("clientID").isMongoId();
    fullNameBodyValidator = body("fullName")
    .notEmpty()
    .bail()
    .isString()
    .bail()
    .isLength({ max: 40 })
    .trim()
    .escape();
    
    exports.phoneNumberBodyValidator = body("phoneNumber")
    .notEmpty()
    .bail()
    .isString()
    .isLength({ max: 20 })
    .trim()
    .escape();
     exports.emailBodyValidator = body("email")
     .notEmpty()
     .bail()
     .trim()
     .escape()
     .isEmail();
    exports.addressBodyValidator = body("address")
    .notEmpty()
    .isString()
    .bail()
    .isLength({ max: 100 })
    .trim()
    .escape();

    exports.walletBodyValidator = body("wallet")
  .notEmpty()
  .bail()
  .isLength({ max: 10 })
  .trim()
  .escape();
