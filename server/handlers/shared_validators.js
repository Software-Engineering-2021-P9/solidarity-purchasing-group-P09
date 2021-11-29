const { ObjectId } = require("bson");
const { ProductCategory } = require("../models/product");

const { body, param, validationResult, query } = require("express-validator");
const configOverrideAuth = require ("../services/overrideAuth");

exports.checkValidationErrorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.checkUserRoleMiddleware = (userRoles) => {
  return (req, res, next) => {
    if(configOverrideAuth.overrideAuth){
      next(); 
      return; 
    }
    if (!userRoles?.includes(req?.user.role)) {
      return res?.status(401).end();
    }
    next();
  };
};

// shared validators

exports.employeeIDPathValidator = param("employeeID").isMongoId();
exports.clientIDPathValidator = param("clientID").exists().isMongoId();

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

// client validators
exports.clientIDBodyValidator = body("clientID").isMongoId();

// employee validators
exports.employeeIDPathValidator = param("employeeID").isMongoId();

exports.addFundToWalletBodyValidator = body("increaseBy")
  .notEmpty()
  .bail()
  .isFloat({ min: 0 });

//products

// product validators
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

// order validators
exports.orderProductsBodyValidator = body("products")
  .exists()
  .isArray()
  .bail()
  .isLength({ min: 1, max: 20 });

exports.orderProductIDsBodyValidator = body("products.*.productID")
  .exists()
  .isMongoId();

exports.orderProductQtysBodyValidator = body("products.*.quantity")
  .exists()
  .isInt({
    min: 1,
    max: 100,
  });

exports.orderClientIDQueryValidator = query("clientID").isMongoId();

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
  .isLength({ min: 0 });
