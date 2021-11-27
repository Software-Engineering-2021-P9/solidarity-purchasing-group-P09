"use strict";

const { MongoClient } = require("mongodb");
const { getEmployeeByID, createEmployee } = require("./employee");

const { createOrder, getOrderByID, deleteOrder } = require("./order");

const { getClientByID, addFundToWallet, findClients, createClientsTextSearchIndexes, createClient } = require("./client");

const { getProductsAvailability, getProductAvailability, setProductAvailability } = require("./productsAvailabilities");


const {
  getProductsByIDs,
  findProducts,
  createProductsTextSearchIndexes,
  getProductByID,
  findProductsByFarmerID
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

exports.deleteEmployee = (employeeID) => deleteEmployee(db, employeeID);
exports.getClientByID = (clientID) => getClientByID(db, clientID);
exports.addFundToWallet = (clientID, increaseBy) => addFundToWallet(db, clientID, increaseBy);
exports.findClients = (searchString) => findClients(db, searchString);

exports.createClientsTextSearchIndexes = () =>
  createClientsTextSearchIndexes(db);

// --------------
// CreateClient
// --------------
exports.getClientByID = (clientID) => getClientByID(db, clientID);
exports.createClient = (fullName, phoneNumber, email, address, wallet) =>
  createClient(db, fullName, phoneNumber, email, address, wallet);

