const { ObjectId } = require("bson");
const { body, param } = require("express-validator");
const { Product } = require("../models/product");

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
  .if(body('category').exists())
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isIn(Object.values(Product.Categories))
  .trim()
  .escape();

  exports.searchStringValidator = body("searchString")
  .if(body('searchString').exists())
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .escape();

  exports.IDsValidator = body("IDs")
  .if(body('IDs').exists())
  .notEmpty()
  .bail()
  .isString()
  .bail()
  .isLength({ max: 100 })
  .trim()
  .custom(value=>{
    const splittedID=value.split(",");
    if(splittedID.length==splittedID.filter(id=>ObjectId.isValid(id)).length)
    return true
    return false;
  })
  .escape();
 