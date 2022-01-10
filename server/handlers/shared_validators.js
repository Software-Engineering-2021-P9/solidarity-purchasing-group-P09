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
exports.managerIDPathValidator = param("managerID").exists().isMongoId();
exports.employeeIDPathValidator = param("employeeID").exists().isMongoId();
exports.clientIDPathValidator = param("clientID").exists().isMongoId();
exports.productIDPathValidator = param("productID").exists().isMongoId();
exports.productAvailabilityIDPathValidator = param("availabilityID")
  .exists()
  .isMongoId();
exports.farmerIDPathValidator = param("farmerID").exists().isMongoId();
exports.weekphaseIDBodyValidator = body("weekphaseID")
  .exists()
  .optional({ nullable: true })
  .isAlphanumeric(undefined, { ignore: "-" });

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

exports.orderPickUpSlotBodyValidator = body("shipmentInfo.pickUpSlot")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .custom((value) => {
    const possiblePickUpSlots = [
      { /*"WED 09:00-23:59": */ from: "30900", to: "32359 " },
      { /*"THU 00:00-23:59": */ from: "40000", to: "42359" },
      { /*"FRI 00:00-22:00": */ from: "50000", to: "52200" },
    ];

    return possiblePickUpSlots.some(
      (slot) => value >= slot.from && value <= slot.to
    );
  });

exports.orderShipmentTypeBodyValidator = body("shipmentInfo.type")
  .notEmpty()
  .bail()
  .isString()
  .custom((value) => {
    return value === "pickup" || value === "shipment";
  });

exports.orderAddressBodyValidator = body("shipmentInfo.address")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 150 })
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

exports.hasPendingCancelationValidator = query("hasPendingCancelation")
  .optional()
  .notEmpty()
  .bail()
  .isBoolean();

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

exports.telegramChatIDValidator = body("chatID")
  .notEmpty()
  .bail()
  .isInt({ min: 0 });
