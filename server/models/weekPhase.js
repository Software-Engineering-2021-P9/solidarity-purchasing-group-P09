"use strict";

//From "Monday:22:30:14" to ["1","22","30","14"]
function dataSplitter(data){
  data = data.split(":");
  switch(data[0]){
    case "Monday":
      data[0] = "1";
      break;
    case "Tuesday":
      data[0] = "2";
      break;
    case "Wednesday":
      data[0] = "3";
      break;
    case "Thursday":
      data[0] = "4";
      break;
    case "Friday":
      data[0] = "5";
      break;
    case "Saturday":
      data[0] = "6";
      break;
    case "Sunday":
      data[0] = "7";
      break;
  }
  return data;
}

//From "Monday:22:30:14" to 1223014
function convertDataFormat(data){
  data = dataSplitter(data);
  let dataString = "";
  for(let x of data){
    dataString = dataString + x;
  }
  return dataString;
}

class WeekPhase {
  constructor(ID, startTime, endTime, description) {
    this.ID = ID;
    this.startTime = startTime;
    this.endTime = endTime;
    this.description = description || "no description";
  }

  //GETTERS
  getID(){
    return this.ID;
  }
  getStartTime(){
    return this.startTime;
  }
  getEndTime(){
    return this.endTime;
  }
  getDescription(){
    return this.description;
  }

  //METHODS
  getTimeRange(){
    return [this.startTime, this.endTime];
  }

  isActiveDuringData(data){//Returns true if the parameter data is between the start and end data of this phase
    //TODO: controls about data format (need to be "dayName:HH:mm:ss")
    data = convertDataFormat(data);
    let startTimeObj = convertDataFormat(this.startTime);
    let endTimeObj = convertDataFormat(this.endTime);

    if(startTimeObj < endTimeObj){//phase not cross weeks
      if(data>=startTimeObj && data<=endTimeObj)
        return true;
      return false;
    }else{//phase is cross weeks
      if(data>=startTimeObj || data<=endTimeObj)
        return true;
      return false;
    }
  }
}

module.exports = { WeekPhase, dataSplitter };