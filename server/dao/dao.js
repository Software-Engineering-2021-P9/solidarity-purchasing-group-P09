"use strict";

const { MongoClient } = require("mongodb");
const {
  getEmployeeByID,
  createEmployee,
  getEmployeeByEmail,
} = require("./employee");

const { getFarmerByID, getFarmerByEmail } = require("./farmer");

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

const { getProductsAvailability, getProductAvailability, setProductAvailability } = require("./productsAvailabilities");

const {
  createOrder,
  getOrderByID,
  deleteOrder,
  getOrdersByClientID,
} = require("./order");

const {
  getProductsByIDs,
  findProducts,
  createProductsTextSearchIndexes,
  getProductByID,
  findProductsByFarmerID
} = require("./products");

const { ClientInfo } = require("../models/client_info");
const { EmployeeInfo } = require("../models/employee_info");
const { FarmerInfo } = require("../models/farmer_info");

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
exports.getEmployeeByEmail = (email) => getEmployeeByEmail(db, email);
exports.createEmployee = (email, hashedPassword, fullName) =>
  createEmployee(db, email, hashedPassword, fullName);
exports.deleteEmployee = (employeeID) => deleteEmployee(db, employeeID);

// Farmer
exports.getFarmerByID = (farmerID) => getFarmerByID(db, farmerID);
exports.getFarmerByEmail = (email) => getFarmerByEmail(db, email);

// Client
exports.getClientByID = (clientID) => getClientByID(db, clientID);
exports.createClient = (fullName, phoneNumber, email, address, wallet) =>
  createClient(db, fullName, phoneNumber, email, address, wallet);
exports.findClients = (searchString) => findClients(db, searchString);
exports.addFundToWallet = (clientID, increaseBy) =>
  addFundToWallet(db, clientID, increaseBy);

// Product
exports.getProductsByIDs = (ids) => getProductsByIDs(db, ids);
exports.findProducts = (searchString, category) =>
  findProducts(db, searchString, category);

exports.createProductsTextSearchIndexes = () => {
  createProductsTextSearchIndexes(db);
};

exports.getProductsAvailability = (listOfIDs, week, year) => getProductsAvailability(db, listOfIDs, week, year);
exports.getProductAvailability = (productID, week, year) => getProductAvailability(db, productID, week, year);
exports.getProductByID = (productID) => getProductByID(db, productID);
exports.setProductAvailability = (farmerID, productID, week, year, price, packaging, quantity) => setProductAvailability(db, farmerID, productID, week, year, price, packaging, quantity)
exports.findProductsByFarmerID = (farmerID, searchString, category) => findProductsByFarmerID(db, farmerID, searchString, category);

// Order
exports.createOrder = (clientID, products, status, totalPrice, createdAt) =>
  createOrder(db, clientID, products, status, totalPrice, createdAt);
exports.getOrderByID = (orderID) => getOrderByID(db, orderID);
exports.deleteOrder = (orderID) => deleteOrder(db, orderID);
exports.getOrdersByClientID = (clientID) => getOrdersByClientID(db, clientID);

exports.createClientsTextSearchIndexes = () =>
  createClientsTextSearchIndexes(db);

// User (Client, Farmer, Employee)
exports.getUserByEmail = async (email) => {
  let usersFound = await Promise.all([
    getClientByEmail(db, email),
    getFarmerByEmail(db, email),
    getEmployeeByEmail(db, email),
  ]).then(([clientInfo, farmerInfo, employeeInfo]) => {
    let users = [];
    if (clientInfo) users.push(ClientInfo.fromMongoJSON(clientInfo));
    if (farmerInfo) users.push(FarmerInfo.fromMongoJSON(farmerInfo));
    if (employeeInfo) users.push(EmployeeInfo.fromMongoJSON(employeeInfo));
    return users;
  });

  if (usersFound?.length === 0) {
    throw new Error("no user found");
  }
  return usersFound[0];
};
