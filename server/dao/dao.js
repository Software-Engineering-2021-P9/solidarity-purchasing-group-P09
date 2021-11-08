"use strict";

const { MongoClient } = require("mongodb");
const { getEmployeeByID, createEmployee } = require("./employee");
const {getProducts}=require("./products")
const client = new MongoClient(process.env.MONGO_CONN_STR);

const db = client.db(process.env.MONGO_DB_NAME);

client.connect((err, result) => {
  if (err) {
    console.error("error during connection to database: " + err);
  }
});

exports.getEmployeeByID = (employeeID) => getEmployeeByID(db, employeeID);
exports.createEmployee = (email, hashedPassword, fullName) =>
  createEmployee(db, email, hashedPassword, fullName);

exports.getProducts=(category, searchString, IDs)=>getProducts(db,category, searchString, IDs);
