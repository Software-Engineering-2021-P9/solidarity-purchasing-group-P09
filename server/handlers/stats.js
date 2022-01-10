var dao = require("../dao/dao");
const { ObjectID } = require("bson");

const {
  UnretrievedOrdersStats,
} = require("../models/unretrieved_orders_stats");

const {
  weekQueryValidator,
  yearQueryValidator,
  startWeekQueryValidator,
  endWeekQueryValidator,
  startYearQueryValidator,
  endYearQueryValidator,
} = require("./shared_validators");

exports.weeklyUnretrievedOrdersStatsValidatorChain = [
  weekQueryValidator,
  yearQueryValidator,
];

exports.weeklyUnretrievedOrdersStatsHandler = async function (req, res, next) {
  if (
    !(req.query.week && req.query.year) &&
    (req.query.week || req.query.year)
  ) {
    return res.status(400).end();
  }

  let unretrievedOrdersCount;
  try {
    unretrievedOrdersCount = await dao.countWeekUnretrievedOrders(
      parseInt(req.query.week),
      parseInt(req.query.year)
    );
  } catch (err) {
    console.error(
      `WeeklyUnretrievedOrdersStatsHandler() -> couldn't retrieve the count of unretrieved orders: ${err}`
    );
    return res.status(500).end();
  }

  let ordersCount;
  try {
    ordersCount = await dao.countWeekOrders(
      parseInt(req.query.week),
      parseInt(req.query.year)
    );
  } catch (err) {
    console.error(
      `WeeklyUnretrievedOrdersStatsHandler() -> couldn't retrieve the count of orders: ${err}`
    );
    return res.status(500).end();
  }

  res.json(new UnretrievedOrdersStats(ordersCount, unretrievedOrdersCount));
};

exports.timeIntervalUnretrievedOrdersStatsValidatorChain = [
  startWeekQueryValidator,
  endWeekQueryValidator,
  startYearQueryValidator,
  endYearQueryValidator,
];

exports.timeIntervalUnretrievedOrdersStatsHandler = async function (
  req,
  res,
  next
) {
  let unretrievedOrdersCount;
  try {
    unretrievedOrdersCount = await dao.countTimeIntervalUnretrievedOrders(
      parseInt(req.query.startWeek),
      parseInt(req.query.endWeek),
      parseInt(req.query.startYear),
      parseInt(req.query.endYear)
    );
  } catch (err) {
    console.error(
      `WeeklyUnretrievedOrdersStatsHandler() -> couldn't retrieve the count of unretrieved orders: ${err}`
    );
    return res.status(500).end();
  }

  let ordersCount;
  try {
    ordersCount = await dao.countTimeIntervalOrders(
      parseInt(req.query.startWeek),
      parseInt(req.query.endWeek),
      parseInt(req.query.startYear),
      parseInt(req.query.endYear)
    );
  } catch (err) {
    console.error(
      `WeeklyUnretrievedOrdersStatsHandler() -> couldn't retrieve the count of orders: ${err}`
    );
    return res.status(500).end();
  }

  res.json(new UnretrievedOrdersStats(ordersCount, unretrievedOrdersCount));
};
