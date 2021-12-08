"use strict";

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

module.exports = { WeekPhaseInterval };