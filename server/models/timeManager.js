const { WeekPhase } = require("./WeekPhase");
const{ dataSplitter } = require("./WeekPhase");
var cron = require('node-cron');
const dayjs = require("dayjs");

//from "Monday:22:30:14" to "14 30 22 * * 1"
function convertTimeFormat_To_CronStringFormat(data){
    data = dataSplitter(data)
    return "" + data[3] + " " + data[2] + " " + data[1] + " * * " + data[0];
}

//APPUNTO: CAMBIA THIS CHE E' UN ERRORE DI COPIA INCOLLA
function scheduleEnablePhase(phase){
    cron.schedule(convertTimeFormat_To_CronStringFormat(phase.getEndTime()), () => {
        const index = this.inactivePhasesList.indexOf(phase);
        this.inactivePhasesList.splice(index,1);
        this.activePhasesList.push(phase);
        scheduleDisablePhase();
    });
}
//APPUNTO: CAMBIA THIS CHE E' UN ERRORE DI COPIA INCOLLA
function scheduleDisablePhase(phase){
    cron.schedule(convertTimeFormat_To_CronStringFormat(phase.getEndTime()), () => {
        const index = this.activePhasesList.indexOf(phase);
        this.activePhasesList.splice(index,1);
        this.inactivePhasesList.push(phase)
        scheduleEnablePhase();
    });
}


class TimeManager {
    constructor() {
      this.setVirtual(false);//TODO: implement virtualization
      this.setInactivePhasesList(); //TODO: better if retrived from db rather than hardcoded? To discuss
      this.setActivePhasesList();
      //this.setCron();
    }

    //GETTERS
    getVirtual(){
        return this.virtual;
    }
    getInactivePhasesList(){
        return this.inactivePhasesList;
    }
    getActivePhasesList(){
        return this.activePhasesList;
    }
    getPhasesList(){
        return this.activePhasesList.concat(this.inactivePhasesList);
    }

    //SETTERS
    setInactivePhasesList(){
        this.inactivePhasesList = [];

        let wp = new WeekPhase(1,
            "Wednesday:00:00:00", "Saturday:09:00:00",
            "By Saturday morning at 9 am farmers provide estimates of available products (with prices and quantities)");
        this.inactivePhasesList.push(wp);

        wp = new WeekPhase(2,
            "Saturday:09:00:00", "Sunday:23:00:00", 
            "Orders from clients are accepted until Sunday 23:00");
        this.inactivePhasesList.push(wp);

        wp = new WeekPhase(3,
            "Sunday:23:00:00", "Monday:09:00:00", 
            "On Monday by 9:00 am the Farmers confirm available products");
        this.inactivePhasesList.push(wp);
        
        wp = new WeekPhase(4, 
            "Monday:09:00:00", "Wednesday:00:00:00", 
            "Clients can schedule pick-up times");
        this.inactivePhasesList.push(wp);
        
        wp = new WeekPhase(5, 
            "Monday:09:00:00", "Wednesday:00:00:00", 
            "By Tuesday evening farmers deliver their products to SPG organization");
        this.inactivePhasesList.push(wp);

        wp = new WeekPhase(6, 
            "Wednesday:00:00:00", "Saturday:00:00:00", 
            "Pickups take place from Wednesday morning until Friday evening. Optionally delivery at home is possible with an extra fee");
        this.inactivePhasesList.push(wp);
    }

    setActivePhasesList(){
        this.activePhasesList = [];
        let now = dayjs().format('dddd:HH:mm:ss');
//TODO: dont know if changing the array itself during for each may cause problem. Debug found no problems.
// Discuss, and eventually change behavior
        this.inactivePhasesList.forEach(phase=>{
            if(phase.isActiveDuringData(now)){
                this.activePhasesList.push(phase);
                const index = this.inactivePhasesList.indexOf(phase);
                this.inactivePhasesList.splice(index,1);
            }
        });
    }

    setVirtual(booleanFlag){
        if(booleanFlag){
            this.virtual = true;
            return;
        }
        this.virtual = false;
    }

    //METHODS
    setCron(){
        //for active phases, set crono that do: disable + set crono for re-enable.
        this.activePhasesList.forEach(phase=>{
            scheduleDisablePhase(phase);
        });
        //for inactive phases, set crono that do: enable + set crono for disable. 
        this.inactivePhasesList.forEach(phase=>{
            scheduleEnablePhase(phase);
        });
    }

    checkIfActivePhase(weekPhaseID){
        let IDList = this.activePhasesList.map(phase=>phase.ID);
        //TODO: return this.activePhasesList.filter(p => p.ID == weekPhaseID).length > 0
        if(IDList.includes(weekPhaseID))
            return true;
        return false;
    }
  }
  
  let timeManagerObj = new TimeManager();
  console.log(timeManagerObj);

  module.exports = timeManagerObj;



  /*

    phaseIDOverride = null

    setPhaseOverride(phaseID) =>
        if (phaseID == null){
            phaseIDOverride = null
            accendo cron
        }
        if (phaseID != phaseIDOverride)
            phaseIDOverride = phaseID
            disabilito cron
            find(phaseIDOverride).handler()
    

    activePhase = qualcosa
    phaseList = [{id:"fasecarina", from:"1:0900", to:"3:1200", handler:()=>{funzione da eseguire quando divento attiva}}]

    getCurrentPhase() => return phaseIDOverride ?? activePhase
    
    cron: ogni minuto getCurrentPhase se != da activePhase -> sovrascrive e chiama handler


    now = dayjs()
    now.weekDay+":"+now.hour+now.minutes
  */