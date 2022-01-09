"use strict";

const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");
const isoWeeksInYear = require("dayjs/plugin/isoWeeksInYear");
const isLeapYear = require("dayjs/plugin/isLeapYear");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);

exports.getNowDate = () => dayjs().utc();

// ---------------
// Client Weekyear
// ---------------

// Return the next weekyear for the client (NWC)
exports.getNextWeekClient = () => {
  let now = this.getNowDate();

  let currentWeek = now.isoWeek() + 1;
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeClientWeek(
    now,
    currentWeek,
    currentYear
  );
  return [currentWeek, currentYear];
};

// Return the next weekyear for the client (CWC)
exports.getCurrentWeekClient = () => {
  let now = this.getNowDate();

  let currentWeek = now.isoWeek();
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeClientWeek(
    now,
    currentWeek,
    currentYear
  );
  return [currentWeek, currentYear];
};

const normalizeClientWeek = (now, currentWeek, currentYear) => {
  if (
    now.tz("Europe/Rome").isoWeekday() === 7 &&
    now.tz("Europe/Rome").hour() >= 23
  ) {
    currentWeek++;
  }

  if (currentWeek > now.isoWeeksInYear()) {
    currentWeek = currentWeek % now.isoWeeksInYear();

    if (now.year() != now.add(7, "day").year()) {
      currentYear++;
    }
  }

  return [currentWeek, currentYear];
};

// ---------------
// Farmer Weekyear
// ---------------

// Return the next weekyear for the farmer (NWF)
exports.getNextWeekFarmer = () => {
  let now = this.getNowDate();

  let currentWeek = now.isoWeek() + 1;
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeFarmerWeek(
    now,
    currentWeek,
    currentYear
  );
  return [currentWeek, currentYear];
};

// Return the next weekyear for the farmer (CWF)
exports.getCurrentWeekFarmer = () => {
  let now = this.getNowDate();

  let currentWeek = now.isoWeek();
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeFarmerWeek(
    now,
    currentWeek,
    currentYear
  );
  return [currentWeek, currentYear];
};

const normalizeFarmerWeek = (now, currentWeek, currentYear) => {
  if (
    (now.tz("Europe/Rome").isoWeekday() === 6 &&
      now.tz("Europe/Rome").hour() >= 9) ||
    now.tz("Europe/Rome").isoWeekday() > 6
  ) {
    currentWeek++;
  }

  if (currentWeek > now.isoWeeksInYear()) {
    currentWeek = currentWeek % now.isoWeeksInYear();

    if (now.year() != now.add(7, "day").year()) {
      currentYear++;
    }
  }

  return [currentWeek, currentYear];
};
