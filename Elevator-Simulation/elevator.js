
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
    "4-4": 0.0
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

// get the time it will take the elevator to travel to the destination floor
// by mapping the ryders source-destination as the key in floorToFloor
// then map it to the time in the program
function mapFloorToFloorTime(ryder){
    var keyF = ryder.source.toString() + "-" + ryder.destination.toString();
    var travelTime = floorToFloor[keyF];
    var rideTime = 0;

    switch (travelTime) {
        case 1.0:
            rideTime = 60;
            break;
        case 1.5:
            rideTime = 90;
            break;
        case 1.75:
            rideTime = 105;
            break;
        case 0.5:
            rideTime = 30;
            break;
        case 0.75:
            rideTime = 45;
            break;
        case 0.25:
            rideTime = 15;
            break;
    
        default:    // 0.0
            break;
    }
    return rideTime;
}


function exitElevator(waitingToBoard, waitingToExit){
    var firstInLine = waitingToExit[0];
    var destination = firstInLine.destination;

    // dequeue people from the elevator to the desintation floor
    for (var i = 0; i < waitingToExit.length; i++){
        if (waitingToExit[i].destination === firstInLine.destination){
            var worker = waitingToExit[i].shift();
        }
    }

    // enque people waiting on floor to the elevator
    for (var i = 0; i < waitingToBoard.length; i++){
        if (waitingToBoard[i].source === firstInLine.destination){
            var worker = waitingToBoard[i].shift();
            waitingToExit.push(worker)
        }
    }
}

function moveTimeAndProcessArrivals(ryder, location, waitingToExit, waitingToBoard, capacity, time, indexT){
    var currentTime = ensureTime(time);
    time = getArrivalTime(currentTime, 1, index=indexT);
    
    // if there are people in line check if they are in line at the time
    if (waitingToBoard.length > 0){
        getTimeAtLine(waitingToBoard, time)
    }
    
    if (time === ryders[0].arrivalTime){
        // we know that if the time changes someone might arrive
        var ryder = ryders.shift()  // get a worker
        processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time)
    }
}

// process workers in elevator at a given time
function rideElevator(location, time, waitingToBoard, waitingToExit, elevatorIsBusy, ryders, capacity){
    // loop through each floor
    for (var i = 0; i < 3; i ++){
        var firstInLine = waitingToExit[0];
        var floorToStopAt = firstInLine.destination;   // we will pick the first person to board as the initial destination
    
        var check = checkStop(waitingToExit, floorToStopAt);
        var shouldStop = check[0];
        var gettingOff = check[1];
    
        if (shouldStop === true){   // if there are people getting off

            // get them and remove them from the elevator. then add people who are waiting on that floor
            // to the elevator. should store wait times and check if they are in line at time
            exitElevator(waitingToBoard, waitingToExit);

            // ride the elevator based on the time from floorToFloor and for each time interval
            // then check and see if someone has arrived if so process their arrival
            var rideTime = mapFloorToFloorTime(firstInLine)
            for (var i = 0; i < rideTime; i++){
                moveTimeAndProcessArrivals(ryder, location, waitingToExit, waitingToBoard, capacity, time, 6);
                // var currentTime = ensureTime(time);
                // time = getArrivalTime(currentTime, 1, index=6);
                
                // // if there are people in line check if they are in line at the time
                // if (waitingToBoard.length > 0){
                //     getTimeAtLine(waitingToBoard, time)
                // }
                
                // if (time === ryders[0].arrivalTime){
                //     // we know that if the elevator travels at least two people will arrive
                //     var ryder = ryders.shift()  // get a worker
                //     processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time)
                // }
            }

            // if the elevator stops we should wait half a minute no matter what
            for (var i = 0; i < 3; i ++){
                moveTimeAndProcessArrivals(ryder, location, waitingToExit, waitingToBoard, capacity, time, 5);
                // var currentTime = ensureTime(time);
                // time = getArrivalTime(currentTime, 1);

                // // if there are people in line check if they are in line at the time
                // if (waitingToBoard.length > 0){
                //     getTimeAtLine(waitingToBoard, time)
                // }

                // if (time === ryders[0].arrivalTime){
                //     // we know that in thirty seconds three people should arrive at the elevator
                //     var ryder = ryders.shift()  // get a worker
                //     processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time)
                // }
            }
        }
    }
    return [waitingToBoard, waitingToExit, time, elevatorIsBusy]
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

// roll for the chance to take the stairs
function rollForStairs(chance){
    var roll = Math.random();
    if (1.0 - chance > roll){
        return false;
    }
    else{
        return true;
    }
}

// append data for visualization and metrics about elevator
function getTimeAtLine(arrRyder, time){
    for (var i = 0; i < arrRyder.length; i++){
        if (time[0] === '8' && time[2] === '3' && time[3] === '0'){
            workersAt830.push(arrRyder[i].id);
        }
        if (time[0] === '8' && time[2] === '4' && time[3] === '5'){
            workersAt845.push(arrRyder[i].id);
        }
        if (time[0] === '9' && time[2] === '0' && time[3] === '0'){
            workersAt9.push(arrRyder[i].id);
        }
    }
    // var currentTime = ensureTime(time);
    //time = getArrivalTime(currentTime, 1, index=6);
}

// compute the times for someone who will walk 
function walkToFloor(ryder, time){
    // I will say that it takes 2 minutes per floor to walk
    var floorsToWalk = ryder.destination - ryder.source;
    waitTimes.push(0);  // if you walk you don't wait for the elevator
    
    if (ryder.destination === 2){   // for whatever floor you walk to add one
        walkedTo2.push(ryder.id);
    }
    else if (ryder.destination === 3){
        walkedTo3.push(ryder.id);
    }
    else{
        walkedTo4.push(ryder.id);
    }
    var arr = [ryder]
    getTimeAtLine(arr, time);

}

// there is no specification for how long it should take someone to walk the stairs
// this means we do not need to calculate their times for travel but we need to store
// the data that is relevant
function determineIfWalking(peopleWaitingOnElevator, tolerenceToWait, ryder, time){
    if (peopleWaitingOnElevator.length > tolerenceToWait){  // if there are too many people waiting then consider walking
        var isWalking = rollForStairs(ryder.stairChance);
        if (isWalking === false){
            peopleWaitingOnElevator.push(ryder);
        }
        else{
            //walk to your floor
            walkToFloor(ryder, time);
        }
    }
}

// process a new arrival by either making them board the elevater
// walking to the floor of destination or waiting in line
function processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time){
    if (location === ryder.source){ // if worker is on the same floor as elevator
        if (waitingToExit.length <= capacity){   // if # of people in elevator is less then capacity board elevator
            waitingToExit.push(ryder);
        }
        else{   // consider either: waiting for the elevator or walking
            determineIfWalking(waitingToBoard, capacity, ryder, time)
        }
        
    }
    else{   // how should you know there are people waiting on other floors?
        waitingToBoard.push(ryder);
    }
}

function elevatorSimulation(){

    var time = "8:00:00";
    var capacity = 12;  // both the elevator capacity and the number of people to wait before walking
    var elevatorLocation = 0;
    var waitingToBoard = [];
    var waitingToExit = [];
    var elevatorIsBusy = false;
    var finalWorker = new Ryder(-1, 0, 0, 0, "",)


    var ryders = createRyders();
    ryders = ryders.slice(0, 10)
    
    while(waitingToBoard.length > 0 || ryder.length > 0 || waitingToExit.length > 0){
        var ryder = ryders.shift()  // get a worker
        while (time != ryder.arrivalTime){  // every second wait for someone to arrive
            // increment time: index=6 is seconds
            var currentTime = ensureTime(time);
            time = getArrivalTime(currentTime, 1, index=6);
            if (waitingToExit.length > 0){// && elevatorIsBusy == false){
                var ride = rideElevator(elevatorLocation, time, waitingToBoard, waitingToExit, elevatorIsBusy, ryders, capacity);
                waitingToBoard = ride[0];
                waitingToExit = ride[1];
                time = ride[2];
                elevatorIsBusy = ride[3];
            }
        }

        // determine if a work should enter the elevator, walk, or wait
        processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time)
        
        if (waitingToExit.length > 0 && elevatorIsBusy == false){
            var ride = rideElevator(elevatorLocation, time, waitingToBoard, waitingToExit, elevatorIsBusy, ryders, capacity);
            waitingToBoard = ride[0];
            waitingToExit = ride[1];
            time = ride[2];
            elevatorIsBusy = ride[3];
        }

        // increment time: index=6 is seconds
        var currentTime = ensureTime(time);
        time = getArrivalTime(currentTime, 1, index=6);
    }

    walkedTo2 = [...new Set(walkedTo2)];
    walkedTo3 = [...new Set(walkedTo3)];
    walkedTo4 = [...new Set(walkedTo4)];

    workersAt830 = [...new Set(workersAt830)];
    workersAt845 = [...new Set(workersAt845)];
    workersAworkersAt9t830 = [...new Set(workersAt9)];
}


var waitTimes = [];
var walkedTo2 = [];
var walkedTo3 = [];
var walkedTo4 = [];
var workersAt830 = [];
var workersAt845 = [];
var workersAt9 = [];
