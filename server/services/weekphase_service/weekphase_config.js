"use strict";

const { WeekPhase } = require("./models/weekphase");

// Weekphases configuration
// No overlapping phases are allowed
exports.weekphasesConfig = [
  new WeekPhase("weekphase-1", "00000", "02300", weekphaseOneHandler),
  new WeekPhase("weekphase-2", "02300", "10900", weekphaseTwoHandler),
  new WeekPhase("weekphase-3", "10900", "22200", weekphaseThreeHandler),
  new WeekPhase("weekphase-4", "22200", "30000", weekphaseFourHandler),
  new WeekPhase("weekphase-5", "30000", "30900", weekphaseFiveHandler),
  new WeekPhase("weekphase-6", "30900", "51600", weekphaseSixHandler),
  new WeekPhase("weekphase-7", "51600", "52200", weekphaseSevenHandler),
  new WeekPhase("weekphase-8", "52200", "60900", weekphaseEightHandler),
  new WeekPhase("weekphase-9", "60900", "70000", weekphaseNineHandler), // SUN 00:00 must be set as 70000
];

// Weekphase 1 (SUN 00:00 - SUN 23:00):
//    - Farmers can confirm availability
//    - Clients can make orders
//    - Clients can schedule their order pickup time
function weekphaseOneHandler() {
  console.log("weekphase-1");
}

// - Weekphase 2 (SUN 23:00 - MON 09:00):
//    - Farmers can confirm availability
//    - Clients can schedule their order pickup time
function weekphaseTwoHandler() {
  console.log("weekphase-2");
}

// - Weekphase 3 (MON 09:00 - TUE 22:00):
//    - Farmers should deliver the confirmed products
//    - Clients can schedule their order pickup time
function weekphaseThreeHandler() {
  console.log("weekphase-3");
}

// - Weekphase 4 (TUE 22:00 - WED 00:00):
//    - Clients can schedule their order pickup time
function weekphaseFourHandler() {
  console.log("weekphase-4");
}

// - Weekphase 5 (WED 00:00 - WED 09:00):
//    - Clients can schedule their order pickup time
//    - Farmers can report availability for the next week
//    - Clients can make orders
function weekphaseFiveHandler() {
  console.log("weekphase-5");
}

// - Weekphase 6 (WED 09:00 - FRI 16:00):
//    - Clients can schedule their order pickup time
//    - Farmers can report availability for the next week
//    - Employees can handout orders
//    - Clients can make orders
function weekphaseSixHandler() {
  console.log("weekphase-6");
}

// - Weekphase 7 (FRI 16:00 - FRI 22:00):
//    - Farmers can report availability for the next week
//    - Employees can handout orders
//    - Clients can make orders
function weekphaseSevenHandler() {
  console.log("weekphase-7");
}

// - Weekphase 8 (FRI 22:00 - SAT 09:00):
//    - Farmers can report availability for the next week
//    - Clients can make orders
function weekphaseEightHandler() {
  console.log("weekphase-8");
}

// - Weekphase 9 (SAT 09:00 - SUN 00:00):
//    - Farmers can confirm availability
//    - Clients can make orders
function weekphaseNineHandler() {
  console.log("weekphase-9");
}
