"use strict";

const { MongoClient } = require("mongodb");
const { getEmployeeByID, createEmployee } = require("./employee");

// DAO initialization
// Only one instance can be open at a time. Subsequent calls has no effect.
var client;
var db;
exports.open = () => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_CONN_STR);
    db = client.db(process.env.MONGO_DB_NAME);

    client.connect((err, result) => {
      if (err) {
        console.error("error during connection to database: " + err);
      }
    });
  }
};

exports.close = () => {
  if (client) {
    client.close();
  }
  client = null;
};

// Exported database access methods
exports.getEmployeeByID = (employeeID) => getEmployeeByID(db, employeeID);
exports.createEmployee = (email, hashedPassword, fullName) =>
  createEmployee(db, email, hashedPassword, fullName);
exports.deleteEmployee = (employeeID) => deleteEmployee(db, employeeID);
