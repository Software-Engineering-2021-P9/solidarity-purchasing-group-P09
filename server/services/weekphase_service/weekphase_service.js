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

const cron = require("cron");

const { weekphasesConfig } = require("./weekphase_config");
const { getNowDate } = require("../time_service");

// Main cron instance
// This acts as a single instance: multiple imports refers doesn't create multiple crons.
var cronJob;
var currentWeekphaseID;
var overrideWeekphaseID;
var clientWeekIncrease = 0;
var farmerWeekIncrease = 0;

exports.init = () => {
  overrideWeekphaseID = null;

  if (!cronJob) {
    cronJob = new cron.CronJob(
      "* * * * *",
      checkPhaseChange,
      null,
      null,
      null,
      null,
      true
    );
  }

  if (!cronJob.running) cronJob.start();
};

exports.isCronRunning = () => !!cronJob?.running;

exports.close = () => {
  cronJob.stop();
  overrideWeekphaseID = null;
};

// Checks if the phase has changed.
// If the current time is associated with a different phase, overwrite the current and call the transition handler.
function checkPhaseChange() {
  let nowDate = getNowDate();
  let foundWeekphase = weekphasesConfig.find((wp) => wp.containsDate(nowDate));

  if (foundWeekphase.id !== currentWeekphaseID) {
    currentWeekphaseID = foundWeekphase.id;
    foundWeekphase.handler({
      currentWeekClient: exports.getCurrentWeekClient(),
    });
  }
}

exports.getCurrentWeekphase = () => overrideWeekphaseID ?? currentWeekphaseID;

exports.setWeekphaseOverride = (weekphaseID) => {
  // Check if the override must be removed:
  // - Set the override to null
  // - Restart the cronJob
  if (!weekphaseID && overrideWeekphaseID) {
    clientWeekIncrease = 0;
    farmerWeekIncrease = 0;
    overrideWeekphaseID = null;
    cronJob.start();
    return;
  }

  // Check if the override must be applied or the override weekphase changed:
  // - Stop the cronJob
  // - Set the override
  // - Call the handler for the override weekphase
  if (weekphaseID && weekphaseID !== overrideWeekphaseID) {
    // Check if the passed id is associated to an existing weekphase
    const overrideWeekphase = weekphasesConfig.find(
      (wp) => wp.id === weekphaseID
    );
    if (!overrideWeekphase) throw new Error("weekphase doesn't exist");

    cronJob.stop();
    overrideWeekphaseID = weekphaseID;
    overrideWeekphase.handler({
      currentWeekClient: exports.getCurrentWeekClient(),
    });
  }
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

exports.nextWeekphase = () => {
  let index = weekphasesConfig.findIndex(
    (wp) => wp.id === exports.getCurrentWeekphase()
  );

  let nextIndex = mod(index + 1, weekphasesConfig.length);

  let nextWeekphaseID = weekphasesConfig[nextIndex].id;

  if (index === 0 && nextIndex === 1) {
    clientWeekIncrease++;
  }
  if (index === 7 && nextIndex === 8) {
    farmerWeekIncrease++;
  }

  exports.setWeekphaseOverride(nextWeekphaseID);
};

exports.previousWeekphase = () => {
  let index = weekphasesConfig.findIndex(
    (wp) => wp.id === exports.getCurrentWeekphase()
  );

  let previousIndex = mod(index - 1, weekphasesConfig.length);

  let previousWeekphaseID = weekphasesConfig[previousIndex].id;

  if (index === 1 && previousIndex === 0) {
    clientWeekIncrease--;
  }
  if (index === 8 && previousIndex === 7) {
    farmerWeekIncrease--;
  }

  exports.setWeekphaseOverride(previousWeekphaseID);
};

exports.checkWeekphaseMiddleware =
  (allowedWeekphaseIDs) => (req, res, next) => {
    const currWeekphaseID = this.getCurrentWeekphase();

    if (!allowedWeekphaseIDs.includes(currWeekphaseID)) {
      return res.status(401).json("action not allowed");
    }
    next();
  };

// ---------------
// Client Weekyear
// ---------------

// Return the next weekyear for the client (NWC)
exports.getNextWeekClient = () => {
  let now = getNowDate();

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
  let now = getNowDate();

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
  // If weekphase override is active and the weekphase goes above the next week boundary, increase the current week considering the current weekphase
  if (overrideWeekphaseID) {
    currentWeek += clientWeekIncrease;
  } else if (
    // Else, increase the current week considering the current date
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

  if (currentWeek <= 0) {
    currentYear--;
    currentWeek = now.add(-7, "day").isoWeeksInYear() + currentWeek;
  }

  return [currentWeek, currentYear];
};

// ---------------
// Farmer Weekyear
// ---------------

// Return the next weekyear for the farmer (NWF)
exports.getNextWeekFarmer = () => {
  let now = getNowDate();

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
  let now = getNowDate();

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
  // If weekphase override is active and the weekphase goes above the next week boundary, increase the current week considering the current weekphase
  if (overrideWeekphaseID) {
    currentWeek += farmerWeekIncrease;
  } else if (
    // Else, increase the current week considering the current date
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

  if (currentWeek <= 0) {
    currentYear--;
    currentWeek = now.add(-7, "day").isoWeeksInYear() + currentWeek;
  }

  return [currentWeek, currentYear];
};
