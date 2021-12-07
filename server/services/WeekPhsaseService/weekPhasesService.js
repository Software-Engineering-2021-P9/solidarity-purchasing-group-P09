"use strict"

var cron = require('node-cron');

const {
  getTrueActivePhase,
  setPhaseIDOverride,
  getCurrentPhaseID
} = require("./weekPhasesFunctions");

var phaseIDOverride = null;
var activePhase = getTrueActivePhase();

activePhase.handler();

let cronTask = cron.schedule('* * * * *', ()=> {
  let phase = getTrueActivePhase();

  if(phase === null){
    console.log("Currently no phase");
    activePhase = null;
    return;
  }
  if(phase.id !== activePhase.id){
    console.log("New phase detected!");
    activePhase = phase;
    activePhase.handler();
  }
  else
    console.log("No new phase");
});

cronTask.start();

exports.getCurrentPhaseID = () => getCurrentPhaseID(activePhase, phaseIDOverride);
exports.setPhaseOverride = (phaseID) => {
  phaseIDOverride = setPhaseIDOverride(phaseID, phaseIDOverride, cronTask);
};

