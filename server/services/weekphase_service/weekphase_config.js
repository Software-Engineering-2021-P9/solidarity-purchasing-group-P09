"use strict";

const dayjs = require("dayjs");
const { WeekPhase } = require("./models/weekphase");
const bot = require("../TelegramBot/telegramBot");
var dao = require("../../dao/dao");
const { getCurrentWeekClient } = require("../time_service");

// Weekphases configuration
// No overlapping phases are allowed
exports.weekphasesConfig = [
  new WeekPhase(
    "weekphase-1",
    "00000",
    "02300",
    "Europe/Rome",
    weekphaseOneHandler
  ),
  new WeekPhase(
    "weekphase-2",
    "02300",
    "10900",
    "Europe/Rome",
    weekphaseTwoHandler
  ),
  new WeekPhase(
    "weekphase-3",
    "10900",
    "22200",
    "Europe/Rome",
    weekphaseThreeHandler
  ),
  new WeekPhase(
    "weekphase-4",
    "22200",
    "30000",
    "Europe/Rome",
    weekphaseFourHandler
  ),
  new WeekPhase(
    "weekphase-5",
    "30000",
    "30900",
    "Europe/Rome",
    weekphaseFiveHandler
  ),
  new WeekPhase(
    "weekphase-6",
    "30900",
    "51200",
    "Europe/Rome",
    weekphaseSixHandler
  ),
  new WeekPhase(
    "weekphase-7",
    "51200",
    "52200",
    "Europe/Rome",
    weekphaseSevenHandler
  ),
  new WeekPhase(
    "weekphase-8",
    "52200",
    "60900",
    "Europe/Rome",
    exports.weekphaseEightHandler
  ),
  new WeekPhase(
    "weekphase-9",
    "60900",
    "70000",
    "Europe/Rome",
    weekphaseNineHandler
  ), // SUN 00:00 must be set as 70000
];

/*
CWF => Current Week for Farmers (SAT 09:00 - SAT 09:00)
NWF => Next Week for Farmers
CWC => Current Week for Clients (SUN 23:00 - SUN 23:00)
NWC => Next Week for Clients
*/

// Weekphase 1 (SUN 00:00 - SUN 23:00):
// Farmers:
//    - Confirm availability (CWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
function weekphaseOneHandler() {
  console.log("weekphase-1", dayjs().toISOString());
}

// Weekphase 2 (SUN 23:00 - MON 09:00):
// Farmers:
//    - Confirm availability (CWF)
// Clients:
//    - Can update pickup time (CWC)
// Employee:
//    - Can update pickup time (CWC)
function weekphaseTwoHandler() {
  console.log("weekphase-2", dayjs().toISOString());
}

// Weekphase 3 (MON 09:00 - TUE 22:00):
// Farmers:
//    - Can deliver products (CWF)
// Clients:
//    - Can update pickup time (CWC)
// Employee:
//    - Can update pickup time (CWC)
function weekphaseThreeHandler() {
  // ammazza gli ordini not covered
  // metti a notconfirmed availabilities in waiting
  console.log("weekphase-3", dayjs().toISOString());
}

// Weekphase 4 (TUE 22:00 - WED 00:00):
// Clients:
//    - Can update pickup time (CWC)
// Employee:
//    - Can update pickup time (CWC)
function weekphaseFourHandler() {
  console.log("weekphase-4", dayjs().toISOString());
}

// Weekphase 5 (WED 00:00 - WED 09:00):
// Farmers:
//    - Can report availability (NWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (CWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (CWC)
//    - Can update pickup time (NWC)
function weekphaseFiveHandler() {
  console.log("weekphase-5", dayjs().toISOString());
}

// Weekphase 6 (WED 09:00 - FRI 12:00):
// Farmers:
//    - Can report availability (NWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (CWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (CWC)
//    - Can update pickup time (NWC)
//    - Can handout orders (CWC)
function weekphaseSixHandler() {
  console.log("weekphase-6", dayjs().toISOString());
}

// Weekphase 7 (FRI 12:00 - FRI 22:00):
// Farmers:
//    - Can report availability (NWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
//    - Can handout orders (CWC)
function weekphaseSevenHandler() {
  console.log("weekphase-7", dayjs().toISOString());
}

// Weekphase 8 (FRI 22:00 - SAT 09:00):
// Farmers:
//    - Can report availability (NWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
exports.weekphaseEightHandler = async () => {
  console.log("weekphase-8", dayjs().toISOString());

  try {
    await dao.setPreparedOrdersToUnretrieved(...getCurrentWeekClient());
  } catch (err) {
    console.log(
      `WeekphaseEightHandler() --> Couldn't set current week prepared orders to unretrieved: ${err}`
    );
  }
};

// - Weekphase 9 (SAT 09:00 - SUN 00:00):
// Farmers:
//    - Confirm availability (CWF)
// Clients:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
// Employee:
//    - Can make orders (NWC)
//    - Can update pickup time (NWC)
async function weekphaseNineHandler() {
  console.log("weekphase-9", dayjs().toISOString());

  try {
    //bot needs to write to every clients about the possibility to make new ordes
    await bot.WriteList();
  } catch (error) {
    //if the bot was already deployed it will not work
    console.error("Couldn't call the bot: " + error);
  }
}
