class WeekPhaseDate{
    constructor(weekDay, hour, min){
        this.weekDay = weekDay;
        this.hour = hour;
        this.min = min;
    }

    toString(){
        return "" + this.weekDay + this.hour + this.min;
    }
}

module.exports = { WeekPhaseDate };
