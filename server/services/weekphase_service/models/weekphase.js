"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

class WeekPhase {
  constructor(id, from, to, tz, handler) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.tz = tz;
    this.handler = handler;
  }

  // Checks if a date is within the weekphase boundaries.
  // Input date must be a DayJS object.
  containsDate(date) {
    let weekTimeToCheck = date.tz(this.tz).format("dHHmm");
    return weekTimeToCheck >= this.from && weekTimeToCheck < this.to;
  }
}

module.exports = { WeekPhase };
