"use strict";

class WeekPhase {
  constructor(id, from, to, handler) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.handler = handler;
  }

  // Checks if a date is within the weekphase boundaries.
  // Input date must be a DayJS object.
  containsDate(date) {
    let weekTimeToCheck = date.format("dHHmm");
    return weekTimeToCheck >= this.from && weekTimeToCheck < this.to;
  }
}

module.exports = { WeekPhase };
