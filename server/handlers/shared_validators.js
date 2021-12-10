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

// shared validators

exports.employeeIDPathValidator = param("employeeID").exists().isMongoId();
exports.clientIDPathValidator = param("clientID").exists().isMongoId();
exports.productIDPathValidator = param("productID").exists().isMongoId();
exports.farmerIDPathValidator = param("farmerID").exists().isMongoId();

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

exports.hasAvailabilitySetValidator = query("hasAvailabilitySet")
  .optional()
  .notEmpty()
  .bail()
  .isBoolean();

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

exports.productCategoryBodyValidator = body("category")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isIn(Object.values(ProductCategory));

exports.farmerIDBodyValidator = body("farmerID").exists().isMongoId();

exports.productNameBodyValidator = body("name")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 35 })
  .trim()
  .escape();

exports.productDescriptionBodyValidator = body("description")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
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

exports.orderIDParamValidator = param("orderID").isMongoId();

exports.orderShipmentDayBodyValidator = body("shipmentInfo.date")
  .notEmpty()
  .bail()
  /*.isDate()
  .bail()*/
  .custom((value) => {
    const shipmentDay = new Date(value);
    //it can be only for next week from wednesday 9 am to friday 22 pm
    const today = new Date();
    const daysToReachNextWednesday = 7 - today.getDay() + 3;
    const nextWednesday = new Date(
      today.setDate(today.getDate() + daysToReachNextWednesday)
    );
    const nextFriday = new Date(today.setDate(today.getDate() + 2));
    return nextWednesday <= shipmentDay && shipmentDay <= nextFriday;
  });
exports.orderFeeBodyValidator = body("shipmentInfo.fee")
  .notEmpty()
  .bail()
  .isFloat({
    min: 0,
    max: 50,
  });

exports.orderAddressBodyValidator = body("shipmentInfo.address")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 50 })
  .trim()
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
  .isLength({ min: 0 });

// availability validators

exports.availabilityPriceBodyValidator = body("price")
  .notEmpty()
  .bail()
  .isFloat({ min: 0.01 });

exports.availabilityQuantityBodyValidator = body("quantity")
  .notEmpty()
  .bail()
  .isInt({ min: 1 });

exports.availabilityPackagingBodyValidator = body("packaging")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .trim()
  .escape();
