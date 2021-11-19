"use strict";

class WeekPhase {
  constructor(ID, startTime, endTime, description, handler) {
    this.ID = ID;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description || "no description";
    this.handler = handler;
  }

  //METHODS
  getTimeRange(){
    return [this.startTime, this.endTime];
  }

  isActiveDuringData(dateObj){//Returns true if the parameter time is between the start and end time of this phase

    let dateString = dateObj.toString();
    let startTimeString = this.startTime.toString();
    let endTimeString = this.endTime.toString();

    if(startTimeString < endTimeString){//phase not cross weeks
      return(dateString>=startTimeString && dateString<endTimeString)
    }else{//phase is cross weeks
      return (dateString>=startTimeString || dateString<endTimeString);
    }
  }
}

module.exports = { WeekPhase };










