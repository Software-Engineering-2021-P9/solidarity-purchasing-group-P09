const { Time } = require("./timeModel");
const { WeekPhase } = require("./weekPhase");
var cron = require('node-cron');
const dayjs = require("dayjs");


//Handle of phase called only when phase is enabled

class TimeManager {
    constructor(){
        this.phaseList = this.getPhaseList();
        this.activePhase = this.getTrueActivePhase();
        this.activePhase.handler();
        this.phaseIDOverride = null;
        this.enableCron(); //set this.cronTask
    }

    getPhaseList(){
        return [
            //ID, StartTime, EndTime, Description, Handler
            new WeekPhase("ID1", new Time("Monday","00","00","00"), new Time("Saturday","19","30","00"), "description bla bla bla", ()=>{console.log("try handle 1");}),
            new WeekPhase("ID2", new Time("Saturday","19","30","00"), new Time("Monday","00","00","00"), "description bla bla bla", ()=>{console.log("try handle 2");})
        ];
    }

    getTrueActivePhase(){
        let nowjs = dayjs();
        let now = new Time(nowjs.day(), nowjs.hour(), nowjs.minute(), nowjs.second());

        for(let phase of this.phaseList){
            if(phase.isActiveDuringData(now)){
                return phase;
            }
        }
        return undefined;
    }

    setPhaseOverride(phaseID){
        //this means we are setting the time to "not virtual"
        if(phaseID == null){ 
            if(this.phaseIDOverride == null)
                return;
            this.phaseIDOverride = null;
            this.enableCron();
            return;
        }
        //this means we are setting the time to "virtual"
        if(phaseID != this.phaseIDOverride){
            this.phaseIDOverride = phaseID;
            this.disableCron();
            this.phaseList.filter((phase)=> phaseID==phase.ID )[0].handler();
        }
    }

    enableCron(){
        this.cronTask = cron.schedule('* * * * *', ()=> {

            console.log("Checking if new phase...");
        
            let phase = this.getTrueActivePhase();
            if(phase.ID != this.activePhase.ID){

                console.log("new phase detected!");
                this.activePhase = phase;
                this.activePhase.handler();
            }
        });
        this.cronTask.start();
    }

    disableCron(){
        this.cronTask.stop();
    }

    getCurrentPhaseID(){
        if(this.phaseIDOverride != null)
            return this.phaseIDOverride;
        return this.activePhase.ID;
    }
}

let timeManagerObj = new TimeManager();

module.exports = timeManagerObj;
module.exports = { TimeManager };

/********************************
  MARCO INPUT:
*********************************

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