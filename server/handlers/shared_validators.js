const { ObjectId } = require("bson");
const { body, param } = require("express-validator");
const { ProductCategory } = require("../models/product");

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

exports.productIdValidator = param("id").isMongoId();
exports.farmerIdValidator = param("id").isMongoId();
exports.productNameValidator = body("name")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 25 })
  .trim()
  .escape();

exports.productDescriptionValidator = body("description")
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .escape();

exports.productCategoryValidator = body("category")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isIn(Object.values(ProductCategory.Category));

exports.searchStringValidator = body("searchString")
  .optional()
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .escape();

exports.IDsValidator = body("ids")
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
