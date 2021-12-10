"use strict";

const cron = require("cron");

const { getNowDate } = require("../time_service");

const { weekphasesConfig } = require("./weekphase_config");

// Main cron instance
// This acts as a single instance: multiple imports refers doesn't create multiple crons.
var cronJob;
var currentWeekphaseID;
var overrideWeekphaseID;

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
    foundWeekphase.handler();
  }
}

exports.getCurrentWeekphase = () =>
  !overrideWeekphaseID ? currentWeekphaseID : overrideWeekphaseID;

exports.setWeekphaseOverride = (weekphaseID) => {
  // Check if the override must be removed:
  // - Set the override to null
  // - Restart the cronJob
  if (!weekphaseID && overrideWeekphaseID) {
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
    overrideWeekphase.handler();
  }
};

exports.checkWeekphaseMiddleware =
  (allowedWeekphaseIDs) => (req, res, next) => {
    const currWeekphaseID = this.getCurrentWeekphase();

    if (!allowedWeekphaseIDs.includes(currWeekphaseID)) {
      return res.status(400).json("action not allowed");
    }
    next();
  };
