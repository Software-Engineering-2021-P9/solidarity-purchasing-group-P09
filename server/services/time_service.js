"use strict";

const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");
const isoWeeksInYear = require("dayjs/plugin/isoWeeksInYear");
const isLeapYear = require("dayjs/plugin/isLeapYear");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);

exports.getNextWeek = (date) => {
  let now = dayjs(date).utc();

  let currentWeek = now.isoWeek() + 1;
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeWeek(now, currentWeek, currentYear);
  return [currentWeek, currentYear];
};

exports.getCurrentWeek = (date) => {
  let now = dayjs(date).utc();

  let currentWeek = now.isoWeek();
  let currentYear = now.year();

  [currentWeek, currentYear] = normalizeWeek(now, currentWeek, currentYear);
  return [currentWeek, currentYear];
};

const normalizeWeek = (now, currentWeek, currentYear) => {
  if (now.isoWeekday() == 7 && now.hour() >= 23) {
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