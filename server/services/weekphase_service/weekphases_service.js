"use strict"

const dayjs = require("dayjs");
const { WeekPhaseBoundary } = require("./WeekPhaseBoundary");
const { WeekPhaseInterval } = require("./WeekPhaseInterval");

const weekPhases = [
  new WeekPhaseInterval("1", new WeekPhaseBoundary("0","00","00"), new WeekPhaseBoundary("2","19","30"), ()=>{console.log("try handle 1");}),
  new WeekPhaseInterval("2", new WeekPhaseBoundary("2","19","30"), new WeekPhaseBoundary("7","00","00"), ()=>{console.log("try handle 2");})
  //phase 1: sun 00:00 -> tue 19:30
  //phase 2: tue 19:30 -> sun 00:00
];

var cron;
var phaseIDOverride;
var activePhase;
var cronTask;

let getTrueActivePhase = ()=>{
  let nowjs = dayjs();
  let now = new WeekPhaseBoundary(nowjs.day(), nowjs.hour(), nowjs.minute());

  for(let phase of weekPhases){
    if(phase.isDateWithinInterval(now))
      return phase;
  }
};

exports.setUp = () => {
  if(!cron){
    cron = require('node-cron');
    phaseIDOverride = null;
    activePhase = getTrueActivePhase();
    activePhase.handler();
    cronTask = cron.schedule('* * * * *', ()=> {
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
    console.log("weekphase_service setup done correctly");
    cronTask.start();
  }
}

exports.getCurrentPhaseID = ()=>{
  if(phaseIDOverride !== null)
      return phaseIDOverride;
  return activePhase.id;
};

exports.setPhaseIDOverride = (phaseID)=>{
  //this means we are setting the time to "not virtual"
  if(phaseID === null){ 
      phaseIDOverride = null;
      cronTask.start();
      return phaseIDOverride;
  }
  //this means we are setting the time to "virtual"
  if(phaseID !== phaseIDOverride){
      phaseIDOverride = phaseID;
      cronTask.stop();
      weekPhases.filter((phase)=> phaseID===phase.id )[0].handler();
      return phaseIDOverride;
  }
  return phaseIDOverride;
};

