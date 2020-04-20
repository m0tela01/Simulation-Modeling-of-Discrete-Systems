
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
        this.id = id ? id : -1;
        this.source = source;
        this.destination = destination;
        this.stairChance = stairChance;
        this.arrivalTime = arrivalTime;

        this.path = this.source.toString() + this.destination.toString();
        this.waitTime = 0;
        this.walked = false;
        this.exitTime = "0:00:00"
    }
}


// if we do not consider people riding down then the bottom half of the floor to floor matrix
// is only considered when the elevator is not at ground and has no passengers.

// calculate the chance a person will walk instead of take the elevator
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

// string replace by index
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

// calculate the current time
function ensureTime(previoustime){
    var currentTime = "";
    if (previoustime[6] === "9"){   // seconds
        previoustime = setCharAt(previoustime, 6, "0");
        previoustime = setCharAt(previoustime, 5, (parseInt(previoustime[5]) + 1).toString());
    }

    if (previoustime[5] === "6"){   // tens seconds
        previoustime = setCharAt(previoustime, 5, "0");
        previoustime = setCharAt(previoustime, 3, (parseInt(previoustime[3]) + 1).toString());
    }

    if (previoustime[3] === "9"){   // minutes
        previoustime = setCharAt(previoustime, 3, "0");
        previoustime = setCharAt(previoustime, 2, (parseInt(previoustime[2]) + 1).toString());
    }

    if (previoustime[2] === "6"){   // tens minutes
        previoustime = setCharAt(previoustime, 2, "0");
        previoustime = setCharAt(previoustime, 0, (parseInt(previoustime[0]) + 1).toString());
    }
    currentTime = previoustime;
    return previoustime;
}

// update the current time
function getArrivalTime(currentTime, num, index=5){
    return setCharAt(currentTime, index, (parseInt(currentTime[index]) + num).toString())
}

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

a = ryders[190]
a

b = a.path[0].toString() + "-" + a.path[1].toString();
b

ryders = ryders.slice(0, 10)
ryders
c = ryders.length
c

// should calculate exit time of worker
function getExitTime(time, previousTime, arrivalTime){
    var exitTime = "";
    for (var i = 0; i < time; i++){
        var currentTime = ensureTime(previousTime);
        arrivalTime = getArrivalTime(currentTime, 1);
        previousTime = arrivalTime;
    }
    exitTime = previousTime;
    return exitTime;
}

// process workers in elevator at a given time
function rideElevator(location, time, waitingToBoard, waitingToExit){
    var check = checkStop(waitingToExit, location);
    var shouldStop = check[0];
    var gettingOff = check[1];

    if (shouldStop === true){   // if there are people getting off


        for (var i = 0; i < 3; i ++){   // if the elevator stops we should wait half a minute no matter what
            var currentTime = ensureTime(time);
            time = getArrivalTime(currentTime, 1);
        }
    }
    return [waitingToBoard, waitingToExit, time]
}

// get the number of people that need to exit a floor
function checkStop(waitingToExit, location){
    var gettingOff = waitingToExit.filter(p => p.destination === location)
    if (gettingOff.length > 0){ // if there is at least one person who is getting off on this floor
        return [true, gettingOff];
    }
    else{
        return [false, gettingOff];
    }
}

function elevatorSimulation(){

    var time = "8:00:00";
    var capacity = 12;
    var elevatorLocation = 0;
    var waitingToBoard = [];
    var waitingToExit = [];
    var finalWorker = new Ryder(-1, 0, 0, 0, "",)


    var ryders = createRyders();
    ryders = ryders.slice(0, 10)
    
    while(waitingToBoard.length > 0 && ryder.length > 0){
        var ryder = ryders.shift()  // get a worker
        while (time != ryder.arrivalTime){  // every second wait for someone to arrive
            // increment time
            var currentTime = ensureTime(time);
            time = getArrivalTime(currentTime, 1, index=6);
        }

        if (elevatorLocation === ryder.source){ // if worker is on the same floor as elevator
            if (waitingToExit.length < capacity){   // if # of people in elevator is less then capacity board elevator
                waitingToExit.push(ryder);
            }
            else{
                waitingToBoard.push(ryder);
            }
            
        }
        else{
            waitingToBoard.push(ryder);
        }
        
        var ride = rideElevator(elevatorLocation, time, waitingToBoard, waitingToExit);
        waitingToBoard = ride[0];
        waitingToExit = ride[1];
        time = ride[2]

        // increment time
        var currentTime = ensureTime(time);
        time = getArrivalTime(currentTime, 1, index=6);
    }

}

var waitTimes = [];
var walkedTo2 = [];
var walkedTo3 = [];
var walkedTo4 = [];
var workersAt830 = [];
var workersAt845 = [];
var workersAt9 = [];
