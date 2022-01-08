"use strict";

const { ObjectID } = require("bson");
const { OrderStatus } = require("../models/order");

const orderCollectionName = "orders";

exports.countWeekUnretrievedOrders = async (db, week, year) => {
  let query = {};

  if (week && year) {
    query = {
      $and: [
        { week: week },
        { year: year },
        { status: OrderStatus.UNRETRIEVED },
      ],
    };
  } else {
    query = { status: OrderStatus.UNRETRIEVED };
  }

  return db.collection(orderCollectionName).countDocuments(query);
};

exports.countWeekOrders = async (db, week, year) => {
  let query = {};

  if (week && year) {
    query = {
      $and: [{ week: week }, { year: year }],
    };
  }

  return db.collection(orderCollectionName).countDocuments(query);
};

exports.countTimeIntervalUnretrievedOrders = async (
  db,
  startWeek,
  endWeek,
  startYear,
  endYear
) => {
  const query = {
    $and: [
      { week: { $gte: startWeek } },
      { week: { $lte: endWeek } },
      { year: { $gte: startYear } },
      { year: { $lte: endYear } },
      { status: OrderStatus.UNRETRIEVED },
    ],
  };

  return db.collection(orderCollectionName).countDocuments(query);
};

exports.countTimeIntervalOrders = async (
  db,
  startWeek,
  endWeek,
  startYear,
  endYear
) => {
  const query = {
    $and: [
      { week: { $gte: startWeek } },
      { week: { $lte: endWeek } },
      { year: { $gte: startYear } },
      { year: { $lte: endYear } },
    ],
  };

  return db.collection(orderCollectionName).countDocuments(query);
};
