"use strict";

const { MongoClient } = require("mongodb");
const { getEmployeeByID, createEmployee } = require("./employee");

const {
  createOrder,
  getOrderByID,
  deleteOrder,
  getOrdersByClientID,
} = require("./order");

const {
  getClientByID,
  addFundToWallet,
  findClients,
  createClientsTextSearchIndexes,
  createClient,
  getUserById,
  getUser,
  getClientByEmail,
} = require("./client");

const {
  getProductsByIDs,
  findProducts,
  createProductsTextSearchIndexes,
} = require("./products");

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
// Employee
exports.getEmployeeByID = (employeeID) => getEmployeeByID(db, employeeID);
exports.createEmployee = (email, hashedPassword, fullName) =>
  createEmployee(db, email, hashedPassword, fullName);
exports.deleteEmployee = (employeeID) => deleteEmployee(db, employeeID);

// Product
exports.getProductsByIDs = (ids) => getProductsByIDs(db, ids);
exports.findProducts = (searchString, category) =>
  findProducts(db, searchString, category);

exports.createProductsTextSearchIndexes = () => {
  createProductsTextSearchIndexes(db);
};

// Order
exports.createOrder = (clientID, products, status, totalPrice, createdAt) =>
  createOrder(db, clientID, products, status, totalPrice, createdAt);
exports.getOrderByID = (orderID) => getOrderByID(db, orderID);
exports.deleteOrder = (orderID) => deleteOrder(db, orderID);
exports.getOrdersByClientID = (clientID) => getOrdersByClientID(db, clientID);

exports.deleteEmployee = (employeeID) => deleteEmployee(db, employeeID);
exports.getClientByID = (clientID) => getClientByID(db, clientID);
exports.addFundToWallet = (clientID, increaseBy) =>
  addFundToWallet(db, clientID, increaseBy);
exports.findClients = (searchString) => findClients(db, searchString);

exports.createClientsTextSearchIndexes = () =>
  createClientsTextSearchIndexes(db);

// --------------
// CreateClient
// --------------
exports.getClientByID = (clientID) => getClientByID(db, clientID);
exports.createClient = (fullName, phoneNumber, email, address, wallet) =>
  createClient(db, fullName, phoneNumber, email, address, wallet);

exports.getUserById = (clientID) => getUserById(db, clientID);
exports.getUser = (username, password) => getUser(db, username, password);

// User (Client, Farmer, Employee)
exports.getUserByEmail = (email) => {
  let usersFound = await Promise.all([
    getClientByEmail(db, email),
    //getFarmerByEmail(db, email),
    //getEmployeeByEmail(db, email),
  ]);

  if (usersFound.length === 0) {
    throw new Error("no user found");
  }
  return usersFound[0];
};
