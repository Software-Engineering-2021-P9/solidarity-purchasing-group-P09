"use strict";

const { ObjectID } = require("bson");

const employeeCollectionName = "employees";

// ---------------
// GetEmployeeByID
// ---------------

exports.getEmployeeByID = (db, employeeID) => {
  return db.collection(employeeCollectionName).findOne(ObjectID(employeeID));
};

// --------------
// CreateEmployee
// --------------

exports.createEmployee = (db, email, hashedPassword, fullName) => {
  return db
    .collection(employeeCollectionName)
    .insertOne({ email: email, password: hashedPassword, fullName: fullName });
};

// --------------
// DeleteEmployee
// --------------

exports.deleteEmployee = (db, employeeID) => {
  return db
    .collection(employeeCollectionName)
    .deleteOne({ employeeID: employeeID });
};
