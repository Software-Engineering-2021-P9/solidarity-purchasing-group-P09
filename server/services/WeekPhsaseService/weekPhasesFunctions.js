const weekPhases = require("./weekPhaseInterval");
const dayjs = require("dayjs");
const { WeekPhaseDate } = require("./weekPhaseDate");

exports.getTrueActivePhase = ()=>{
    let nowjs = dayjs();
    let now = new WeekPhaseDate(nowjs.day(), nowjs.hour(), nowjs.minute());

    for(let phase of weekPhases.weekPhases){
        if(phase.isDateWithinInterval(now))
            return phase;
    }
    return null;
};

exports.getCurrentPhaseID = (activePhase, phaseIDOverride)=>{
    if(phaseIDOverride !== null)
        return phaseIDOverride;
    if(activePhase !== null)
        return activePhase.id;
    return null;
};

exports.setPhaseIDOverride = (phaseID, phaseIDOverride, cronTask)=>{
    //this means we are setting the time to "not virtual"
    if(phaseID === null){ 
        if(phaseIDOverride === null)
            return phaseIDOverride;
        phaseIDOverride = null;
        cronTask.start();
        return phaseIDOverride;
    }
    //this means we are setting the time to "virtual"
    if(phaseID !== phaseIDOverride){
        phaseIDOverride = phaseID;
        cronTask.stop();
        weekPhases.weekPhases.filter((phase)=> phaseID===phase.id )[0].handler();
        return phaseIDOverride;
    }
  };