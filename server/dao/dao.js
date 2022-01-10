"use strict";

const { MongoClient } = require("mongodb");
const {
  getEmployeeByID,
  createEmployee,
  getEmployeeByEmail,
} = require("./employee");

const { getManagerByID, getManagerByEmail } = require("./manager");

const { getFarmerByID, getFarmerByEmail } = require("./farmer");

const {
  getClientByID,
  addFundToWallet,
  findClients,
  createClientsTextSearchIndexes,
  createClient,
  signupClient,
  getUserById,
  getUser,
  getClientByEmail,
} = require("./client");

const {
  getProductsAvailability,
  getProductAvailability,
  setProductAvailability,
} = require("./productAvailability");

const {
  createOrder,
  getOrderByID,
  deleteOrder,
  getOrdersByClientID,
  completeOrder,
  getOrdersByClientIDList,
} = require("./order");

const {
  getProductsByIDs,
  findProducts,
  createProductsTextSearchIndexes,
  getProductByID,
  findProductsByFarmerID,
  createProduct,
} = require("./product");

const {
  countWeekUnretrievedOrders,
  countWeekOrders,
  countTimeIntervalUnretrievedOrders,
  countTimeIntervalOrders,
} = require("./stats");

const {
  getTelegramUsers,
  addTelegramUsers,
  createUniqueTelegramUserIndex,
} = require("./bot");

const { ClientInfo } = require("../models/client_info");
const { EmployeeInfo } = require("../models/employee_info");
const { FarmerInfo } = require("../models/farmer_info");
const { ManagerInfo } = require("../models/manager_info");

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

exports.createClient = (fullName, phoneNumber, email, address) =>
  createClient(db, fullName, phoneNumber, email, address);

exports.signupClient = (fullName, phoneNumber, email, password, address) =>
  signupClient(db, fullName, phoneNumber, email, password, address);

exports.findClients = (searchString) => findClients(db, searchString);
exports.addFundToWallet = (clientID, increaseBy) =>
  addFundToWallet(db, clientID, increaseBy);

//Manager
exports.getManagerByID = (managerID) => getManagerByID(db, managerID);
exports.getManagerByEmail = (email) => getManagerByEmail(db, email);

// Product
exports.getProductsByIDs = (ids) => getProductsByIDs(db, ids);
exports.findProducts = (searchString, category) =>
  findProducts(db, searchString, category);

exports.createProductsTextSearchIndexes = () => {
  createProductsTextSearchIndexes(db);
};

exports.getProductsAvailability = (listOfIDs, week, year) =>
  getProductsAvailability(db, listOfIDs, week, year);
exports.getProductAvailability = (productID, week, year) =>
  getProductAvailability(db, productID, week, year);
exports.getProductByID = (productID) => getProductByID(db, productID);
exports.setProductAvailability = (
  farmerID,
  productID,
  week,
  year,
  price,
  packaging,
  quantity
) =>
  setProductAvailability(
    db,
    farmerID,
    productID,
    week,
    year,
    price,
    packaging,
    quantity
  );
exports.findProductsByFarmerID = (farmerID, searchString, category) =>
  findProductsByFarmerID(db, farmerID, searchString, category);
exports.createProduct = (farmerID, name, description, category) =>
  createProduct(db, farmerID, name, description, category);

// Order
exports.createOrder = (order) => createOrder(db, order);
exports.getOrderByID = (orderID) => getOrderByID(db, orderID);
exports.getOrdersByClientID = (clientID) => getOrdersByClientID(db, clientID);
exports.completeOrder = (orderID) => completeOrder(db, orderID);
exports.getOrdersByClientIDList = (clientIDList) =>
  getOrdersByClientIDList(db, clientIDList);
exports.createClientsTextSearchIndexes = () =>
  createClientsTextSearchIndexes(db);

// User (Client, Farmer, Employee, Manager)
exports.getUserByEmail = async (email) => {
  let usersFound = await Promise.all([
    getClientByEmail(db, email),
    getFarmerByEmail(db, email),
    getEmployeeByEmail(db, email),
    getManagerByEmail(db, email),
  ]).then(([clientInfo, farmerInfo, employeeInfo, managerInfo]) => {
    let users = [];
    if (clientInfo) users.push(ClientInfo.fromMongoJSON(clientInfo));
    if (farmerInfo) users.push(FarmerInfo.fromMongoJSON(farmerInfo));
    if (employeeInfo) users.push(EmployeeInfo.fromMongoJSON(employeeInfo));
    if (managerInfo) users.push(ManagerInfo.fromMongoJSON(managerInfo));
    return users;
  });

  if (usersFound?.length === 0) {
    throw new Error("no user found");
  }
  return usersFound[0];
};

// Stats

exports.countWeekUnretrievedOrders = (week, year) =>
  countWeekUnretrievedOrders(db, week, year);

exports.countWeekOrders = (week, year) => countWeekOrders(db, week, year);

exports.countTimeIntervalUnretrievedOrders = (
  startWeek,
  endWeek,
  startYear,
  endYear
) =>
  countTimeIntervalUnretrievedOrders(
    db,
    startWeek,
    endWeek,
    startYear,
    endYear
  );

exports.countTimeIntervalOrders = (startWeek, endWeek, startYear, endYear) =>
  countTimeIntervalOrders(db, startWeek, endWeek, startYear, endYear);

  //Telegram BOT
exports.addTelegramUsers = (telegramUser) => addTelegramUsers(db, telegramUser);
exports.getTelegramUsers = () => getTelegramUsers(db);
exports.createUniqueTelegramUserIndex = () => createUniqueTelegramUserIndex(db);
