
var floorToFloor = {
    "1-G": 0.0,
    "1-2": 1.0,
    "1-3": 1.5,
    "1-4": 1.75,
    "2-1": 1.0,
    "2-2": 0.0,
    "2-3": 0.5,
    "2-4": 0.75,
    "3-1": 1.5,
    "3-2": 0.5,
    "3-3": 0.0,
    "3-4": 0.5,
    "4-1": 1.75,
    "4-2": 0.5,
    "4-3": 0.25,
    "4-4": 0
}



class Ryder{
    constructor(id, source, destination, stairChance, arrivalTime){
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.stairChance = stairChance;
        this.arrivalTime = arrivalTime;

        this.path = this.source.toString() + this.destination.toString();
        this.waitTime = 0;
        this.walked = false;
    }
}


// if we do not consider people riding down then the bottom half of the floor to floor matrix
// is only considered when the elevator is not at ground and has no passengers.
function getStairChance(num){
    if (num === 2){
        return 0.5;
    }
    else if (num === 3){
        return 0.33;
    }
    else{
        return 0.10;
    }
}



function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function ensureTime(previoustime){
    var currentTime = "";
    if (previoustime[5] === "6"){   //tens seconds
        previoustime = setCharAt(previoustime, 5, "0");
        previoustime = setCharAt(previoustime, 3, (parseInt(previoustime[3]) + 1).toString());
        // previoustime[5] = "0";
        // previoustime[3] = (parseInt(previoustime[3]) + 1).toString();
    }

    if (previoustime[3] === "9"){   // minutes
        previoustime = setCharAt(previoustime, 3, "0");
        previoustime = setCharAt(previoustime, 2, (parseInt(previoustime[2]) + 1).toString());
        // previoustime[3] = "0";
        // previoustime[2] = (parseInt(previoustime[2]) + 1).toString();
    }

    if (previoustime[2] === "6"){   // tens minutes
        previoustime = setCharAt(previoustime, 2, "0");
        previoustime = setCharAt(previoustime, 0, (parseInt(previoustime[0]) + 1).toString());
        // previoustime[2] = "0";
        // previoustime[0] = (parseInt(previoustime[0]) + 1).toString();
    }
    currentTime = previoustime;
    return previoustime;
}


function getArrivalTime(currentTime, num){
    return setCharAt(currentTime, 5,(parseInt(currentTime[5]) + num).toString())
    // return (parseInt(currentTime[5]) + num).toString();
}

a = ensureTime("8:00:60")
a

// we will choose to statically define the number of people and arrival time as the average
// and mean interal arival rate are given. we should do this because it makes the simulation
// more consistent although less interesting


// 6 people arrive every minute or 1 person ever 0.1667ths of a minute
// each person will arrive in increments of ten seconds
// the first person always arrives right at 8:00:00

function createRyders(){
    var ryders = [];
    var previousTime = "8:00:00";

    for(var i = 0; i < 360; i++){
        var source = 0;
        var destination = 0;
        var arrivalTime = "";
        while (source >= destination){
            source = Math.floor(Math.random() * 10 % 4) + 1;
            destination = Math.floor(Math.random() * 10 % 4) + 1;
        }
        var stairChance = getStairChance(destination);

        var currentTime = ensureTime(previousTime);
        arrivalTime = getArrivalTime(currentTime, 1);
        previousTime = arrivalTime;
        currentTime



        ryders.push(new Ryder(i, source, destination, stairChance, arrivalTime));
    }

    return ryders;
}

var ryders = createRyders();

a = ryders[10]
a

function elevatorSimulation(){

}