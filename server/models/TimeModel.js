class Time{
    constructor(day, hour, min, sec){
        this.day = day;
        this.dayNumber = this.convertDayIntoNumber(day);
        this.hour = hour;
        this.min = min;
        this.sec = sec;
    }

    //METHODS
    convertDayIntoNumber(day){
        switch(day){
          case "Monday":
            day = "1";
            break;
          case "Tuesday":
            day = "2";
            break;
          case "Wednesday":
            day = "3";
            break;
          case "Thursday":
            day = "4";
            break;
          case "Friday":
            day = "5";
            break;
          case "Saturday":
            day = "6";
            break;
          case "Sunday":
            day = "7";
            break;
        }
        return day;
    }

    toString(){
        return "" + this.dayNumber + this.hour + this.min + this.sec;
    }
}

module.exports = { Time };