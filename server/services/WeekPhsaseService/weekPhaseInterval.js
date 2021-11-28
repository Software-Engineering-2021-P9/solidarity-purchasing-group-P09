"use strict";
const { WeekPhaseDate } = require("./weekPhaseDate");

class WeekPhaseInterval {
  constructor(id, startTime, endTime, handler) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.handler = handler;
  }

  //METHODS
  //Returns true if the parameter is between the start and end time of this phase
  isDateWithinInterval(date){
    let dateString = date.toString();
    let startTimeString = this.startTime.toString();
    let endTimeString = this.endTime.toString();

    return (dateString>=startTimeString && dateString<endTimeString);
  }
}

const weekPhases = [
  new WeekPhaseInterval("1", new WeekPhaseDate("0","00","00"), new WeekPhaseDate("2","19","30"), ()=>{console.log("try handle 1");}),
  new WeekPhaseInterval("2", new WeekPhaseDate("2","19","30"), new WeekPhaseDate("7","00","00"), ()=>{console.log("try handle 2");})
  //phase 1: sun 00:00 -> tue 19:30
  //phase 2: tue 19:30 -> sun 00:00
];

module.exports = { weekPhases, WeekPhaseInterval };