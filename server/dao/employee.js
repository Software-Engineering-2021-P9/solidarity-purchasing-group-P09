"use strict";

const { ObjectID } = require("bson");

const employeeCollectionName = "employees";

// ---------------
// GetEmployeeByID
// ---------------

exports.getEmployeeByID = async (db, employeeID) => {
  return await db
    .collection(employeeCollectionName)
    .findOne(ObjectID(employeeID));
};

// --------------
// CreateEmployee
// --------------

exports.createEmployee = async (db, email, hashedPassword, fullName) => {
  return await db
    .collection(employeeCollectionName)
    .insertOne({ email: email, password: hashedPassword, fullName: fullName });
};

// --------------
// DeleteEmployee
// --------------

exports.deleteEmployee = async (db, employeeID) => {
  return await db
    .collection(employeeCollectionName)
    .deleteOne({ employeeID: employeeID });
};
