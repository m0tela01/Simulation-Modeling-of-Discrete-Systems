

var waitTimes = [];
var walkedTo2 = [];
var walkedTo3 = [];
var walkedTo4 = [];
var workersAt830 = [];
var workersAt845 = [];
var workersAt9 = [];

var time = "8:00:00";


var floorToFloor = {
    "1-1": 0.0,
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
        this.id = id ? id : 0;
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
    var update = true;
    if (previoustime[6] === "9"){   // seconds
        previoustime = setCharAt(previoustime, 6, "0");
        previoustime = setCharAt(previoustime, 5, (parseInt(previoustime[5]) + 1).toString());
        update = false;
    }

    if (previoustime[5] === "6"){   // tens seconds
        previoustime = setCharAt(previoustime, 5, "0");
        previoustime = setCharAt(previoustime, 3, (parseInt(previoustime[3]) + 1).toString());
        update = false;
    }

    if (previoustime[3] === "9"){   // minutes
        previoustime = setCharAt(previoustime, 3, "0");
        previoustime = setCharAt(previoustime, 2, (parseInt(previoustime[2]) + 1).toString());
        update = false;
    }

    if (previoustime[2] === "6"){   // tens minutes
        previoustime = setCharAt(previoustime, 2, "0");
        previoustime = setCharAt(previoustime, 0, (parseInt(previoustime[0]) + 1).toString());
        update = false;
    }
    currentTime = previoustime;
    return [previoustime, update];
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

    for(var i = 0; i < 3600; i++){
        var source = 0;
        var destination = 0;
        var arrivalTime = "";
        while (source >= destination){
            source = Math.floor(Math.random() * 10 % 4) + 1;
            destination = Math.floor(Math.random() * 10 % 4) + 1;
        }
        var stairChance = getStairChance(destination);

        var eT = ensureTime(previousTime);
        var currentTime = eT[0];
        var update = eT[1];
        if (i === 0){
            ryders.push(new Ryder(i, source, destination, stairChance, currentTime));
        }
        else if (i %  10 === 0){
            if (update === true){
                arrivalTime = getArrivalTime(currentTime, 1, index=6);
            }
            else{
                arrivalTime = currentTime;
            }
            previousTime = arrivalTime;
            ryders.push(new Ryder(i, source, destination, stairChance, arrivalTime));
        }
        else{
            previousTime = getArrivalTime(currentTime, 1, index=6);
        }

    }

    return ryders;
}


var ryders = createRyders();

a = ryders[6]
a

b = a.path[0].toString() + "-" + a.path[1].toString();
b

ryders = ryders.slice(0, 10)
ryders
c = ryders.length
c

// should calculate exit time of worker
function getExitTime(time, previousTime, arrivalTime){
    // var exitTime = "";
    // for (var i = 0; i < time; i++){
    //     var eT = ensureTime(previousTime);
    //     var currentTime = eT[0];
    //     var update = eT[1];
    //     if (update === true){
    //         arrivalTime = getArrivalTime(currentTime, 1);
    //     }
    //     else{
    //         arrivalTime = currentTime;
    //     }
    //     previousTime = arrivalTime
    // }
    // exitTime = previousTime;
    // return exitTime;
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


function computeWaitTime(arrivalTime, currentTime){
    // var b = "9:13:20";
    // var a = "8:22:59";
    var b = currentTime; //"8:44:55";
    var a = arrivalTime; //"8:22:55";
    var mC = 0;
    var mA = 0;
    var divider = 0;
    var message = "";
    if (b.length > 7){
        mC = (((parseInt(b[0]) * 10) + parseInt(b[1])) * 3600) + 
        ((parseInt(b[3]) * 10 + parseInt(b[4])) * 60) + 
        (parseInt(b[6]) * 10) + (parseInt(b[7]));
        divider = 3600;
        message = "Hours";
    }
    else{
        mC = (b[0] * 3600) + 
        ((parseInt(b[2]) * 10 + parseInt(b[3])) * 60) + 
        (parseInt(b[5]) * 10) + (parseInt(b[6]));
        divider = 60;
        message = "Minutes";
    }

    if (a.length> 7){
        mA = (((parseInt(a[0]) * 10) + parseInt(a[1])) * 3600) + 
        ((parseInt(a[3]) * 10 + parseInt(a[4])) * 60) + 
        (parseInt(a[6]) * 10) + (parseInt(a[7]));
    }
    else{
        mA = (a[0] * 3600) + 
        ((parseInt(a[2]) * 10 + parseInt(a[3])) * 60) + 
        (parseInt(a[5]) * 10) +(parseInt(a[6]));
    }    
    
    return [mC - mA, divider, message]; // output in seconds
}

var p = computeWaitTime("8:22:55", "9:44:55")
p


function enterElevator(waitingToExit, waitingToBoard, time, location){
    // enque people waiting on floor to the elevator
    for (var i = 0; i < waitingToBoard.length; i++){
        if (waitingToBoard[i].source === location && waitingToExit.length <= 12){
            var worker = waitingToBoard[i];
            waitingToBoard = waitingToBoard.splice(i,1);
            
            waitingToExit.push(worker);
            console.log("arrival " + worker.arrivalTime)
            console.log("id " +worker.id)
            console.log("time " + time)
            var waitedTime = computeWaitTime(worker.arrivalTime, time)[0];
            waitTimes.push(waitedTime);
        }
    }
    return [waitingToBoard, waitingToExit, time]
}

function exitElevator(waitingToBoard, waitingToExit, time, location){
    var firstInLine = waitingToExit[0];
    var destination = firstInLine.destination;

    // dequeue people from the elevator to the desintation floor
    for (var i = 0; i < waitingToExit.length; i++){
        if (waitingToExit[i].destination === firstInLine.destination){
            waitingToExit = waitingToExit.splice(i,1);
        }
    }
    var eE = enterElevator(waitingToExit, waitingToBoard, time, location);
    waitingToBoard = eE[0];
    waitingToExit = eE[1];
    time = eE[2];
    

    return [waitingToBoard, waitingToExit, time]
}

// manage time by mapping seconds to clock time using "8:00:00" as the standard format
// update the time and get inter arrivals 
function moveTimeAndProcessArrivals(ryders, location, waitingToExit, waitingToBoard, capacity, time, indexT, isBusy){
    var eT = ensureTime(time);
    var currentTime = eT[0];
    var update = eT[1];
    if (update === true){
        time = getArrivalTime(currentTime, 1, index=indexT);
    }
    else{
        time = currentTime;
    }
    
    // if there are people in line check if they are in line at the time
    if (waitingToBoard.length > 0){
        getTimeAtLine(waitingToBoard, time)
    }

    if (ryders.length > 0){
        if (time === ryders[0].arrivalTime ){
            // we know that if the time changes someone might arrive
            var ryder = ryders.shift()  // get a worker
            // processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time, ryders)
            var pra = processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time, ryders, isBusy)
            elevatorLocation = pra[0];
            waitingToExit = pra[1];
            waitingToBoard = pra[2];
            time = pra[3];
            ryders = pra[4];
            isBusy = pra[5];
        }
    }

    return [ryders, location, waitingToExit, waitingToBoard, time, isBusy];
}

// process workers in elevator at a given time
function rideElevator(location, time, waitingToBoard, waitingToExit, isBusy, ryders, capacity){
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
            var ee = exitElevator(waitingToBoard, waitingToExit, time);
            waitingToBoard = ee[0];
            waitingToExit = ee[1];
            time = ee[2];

            // ride the elevator based on the time from floorToFloor and for each time interval
            // then check and see if someone has arrived if so process their arrival
            location = firstInLine.destination;
            isBusy = true;
            var rideTime = mapFloorToFloorTime(firstInLine)
            for (var i = 0; i < rideTime; i++){
                var mtpa = moveTimeAndProcessArrivals(ryders, location, waitingToExit, waitingToBoard, capacity, time, 6, isBusy);
                ryders = mtpa[0]
                location = mtpa[1];
                waitingToExit = mtpa[2];
                waitingToBoard = mtpa[3]
                time = mtpa[4];
                isBusy = mtpa[5];
            }

            isBusy = false;
            // if new people have arrived since the elevator moved to the next floor make 
            // move them onto the elevator
            var eE = enterElevator(waitingToExit, waitingToBoard, time, location);
            waitingToBoard = eE[0];
            waitingToExit = eE[1];
            time = eE[2];

            // if the elevator stops we should wait half a minute no matter what
            for (var i = 0; i < 30; i ++){
                var mtpa = moveTimeAndProcessArrivals(ryders, location, waitingToExit, waitingToBoard, capacity, time, 6, isBusy);
                ryders = mtpa[0]
                location = mtpa[1];
                waitingToExit = mtpa[2];
                waitingToBoard = mtpa[3]
                time = mtpa[4];
                isBusy = mtpa[5];
            }
        }
    }
    return [waitingToBoard, waitingToExit, time, ryders, location, isBusy]
}

function rideElevatorEmpty(ryder, location, time, waitingToBoard, waitingToExit, isBusy, ryders, capacity){
    // loop through each floor
    
    var firstInLine = ryder;
    var floorToStopAt = firstInLine.destination;   // we will pick the first person to board as the initial destination

    waitingToBoard.push(firstInLine)
    // get them and remove them from the elevator. then add people who are waiting on that floor to the elevator. should store wait times and check if they are in line at time
    // enque people waiting on floor to the elevator
    for (var i = 0; i < waitingToBoard.length; i++){
        if (waitingToBoard[i].source === firstInLine.destination && waitingToExit.length <= 12){
            var worker = waitingToBoard[i];
            waitingToBoard = waitingToBoard.splice(i,1);
            
            waitingToExit.push(worker);
            console.log("arrival " + worker.arrivalTime)
            console.log("time " + time)
            var waitedTime = computeWaitTime(worker.arrivalTime, time)[0];
            waitTimes.push(waitedTime);
        }
    }

    // ride the elevator based on the time from floorToFloor and for each time interval
    // then check and see if someone has arrived if so process their arrival
    location = firstInLine.destination;
    isBusy = true;
    var rideTime = mapFloorToFloorTime(firstInLine)
    for (var i = 0; i < rideTime; i++){
        var mtpa = moveTimeAndProcessArrivals(ryders, location, waitingToExit, waitingToBoard, capacity, time, 6, isBusy);
        ryders = mtpa[0]
        location = mtpa[1];
        waitingToExit = mtpa[2];
        waitingToBoard = mtpa[3]
        time = mtpa[4];
        isBusy = mtpa[5];
    }

    isBusy = false;
    // if new people have arrived since the elevator moved to the next floor make 
    // move them onto the elevator
    var eE = enterElevator(waitingToExit, waitingToBoard, time, location);
    waitingToBoard = eE[0];
    waitingToExit = eE[1];
    time = eE[2];
    
    // if the elevator stops we should wait half a minute no matter what
    for (var i = 0; i < 30; i ++){
        var mtpa = moveTimeAndProcessArrivals(ryders, location, waitingToExit, waitingToBoard, capacity, time, 6, isBusy);
        ryders = mtpa[0]
        location = mtpa[1];
        waitingToExit = mtpa[2];
        waitingToBoard = mtpa[3]
        time = mtpa[4];
        isBusy = mtpa[5];
    }
    
    
    return [waitingToBoard, waitingToExit, time, isBusy, location]
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
function determineIfWalking(waitingToBoard, capacity, ryder, time){
    if (waitingToBoard.length > capacity){  // if there are too many people waiting then consider walking
        var isWalking = rollForStairs(ryder.stairChance);
        if (isWalking === false){
            waitingToBoard.push(ryder);
        }
        else{
            //walk to your floor
            walkToFloor(ryder, time);
        }
    }
    return [waitingToBoard, time]
}

// process a new arrival by either making them board the elevater
// walking to the floor of destination or waiting in line
function processRyderArrival(ryder, location, waitingToExit, waitingToBoard, capacity, time, ryders, isBusy){
    if (location === ryder.source && isBusy === false){ // if worker is on the same floor as elevator and the elevator is not busy
        if (waitingToExit.length <= capacity){   // if # of people in elevator is less then capacity board elevator
            waitingToExit.push(ryder);
            waitTimes.push(0);
        }
        if (waitingToBoard.length > capacity){
            var diw = determineIfWalking(waitingToBoard, capacity, ryder, time)
            waitingToBoard = diw[0];
            time = diw[1];
        }

        else{   // consider either: waiting for the elevator or walking
            var diw = determineIfWalking(waitingToBoard, capacity, ryder, time)
            waitingToBoard = diw[0];
            time = diw[1];
        }
    }

    // how should you know there are people waiting on other floors?
    else if (waitingToExit.length < 1 && isBusy === false){      // if no one is on the elevator we dont need to consider walking because
            // we only consider it if there is a line greater then the capacity

            // and it is not on your floor. move forward in time and make it come to your floor
            var ride = rideElevatorEmpty(ryder, location, time, waitingToBoard, waitingToExit, false, ryders, 12)
            // var ride = rideElevator(elevatorLocation, time, waitingToBoard, waitingToExit, elevatorIsBusy, ryders, capacity);
            waitingToBoard = ride[0];
            waitingToExit = ride[1];
            time = ride[2];
            isBusy = ride[3];
            location = ride[4];
    }
    else{
        waitingToBoard.push(ryder);
    }6

    return [location, waitingToExit, waitingToBoard, time, ryders, isBusy]
}


function elevatorSimulation(){

    var capacity = 12;  // both the elevator capacity and the number of people to wait before walking
    var elevatorLocation = 1;
    var waitingToBoard = [];
    var waitingToExit = [];
    var elevatorIsBusy = false;
    var finalWorker = new Ryder(-1, 0, 0, 0, "",)

    // create some elevator riders
    var ryders = createRyders();


    time = "8:00:00";
    
    // while there are workers that need a ride
    while( ryders.length > 0 ){//waitingToBoard.length > 0 || ryders.length > 0 || waitingToExit.length > 0){
        if (ryders.length > 0){
            var ryder = ryders.shift()  // get a worker
            while (time != ryder.arrivalTime){  // every second wait for someone to arrive
                // increment time: index=6 is seconds
                var eT = ensureTime(time);
                var currentTime = eT[0];
                var update = eT[1];
                if (update === true){
                    time = getArrivalTime(currentTime, 1, index=6);
                }
                else{
                    time = currentTime;
                }
            }
        }
        
        // determine if a worker should enter the elevator, walk, or wait
        var pra = processRyderArrival(ryder, elevatorLocation, waitingToExit, waitingToBoard, capacity, time, ryders, elevatorIsBusy)
        elevatorLocation = pra[0];
        waitingToExit = pra[1];
        waitingToBoard = pra[2];
        time = pra[3];
        ryders = pra[4];
        elevatorIsBusy = pra[5];
        
        // perform elevator riding
        if (waitingToExit.length > 0 && elevatorIsBusy == false){
            var ride = rideElevator(elevatorLocation, time, waitingToBoard, waitingToExit, elevatorIsBusy, ryders, capacity);
            waitingToBoard = ride[0];
            waitingToExit = ride[1];
            time = ride[2];
            ryders = ride[3];
            location = ride[4];
            elevatorIsBusy = ride[5];
        }
    }

    // use this at the end not while testing
    // should update the matrices after to fit plotting function after making sets
    walkedTo2 = [...new Set(walkedTo2)];
    walkedTo3 = [...new Set(walkedTo3)];
    walkedTo4 = [...new Set(walkedTo4)];

    workersAt830 = [...new Set(workersAt830)];
    workersAt845 = [...new Set(workersAt845)];
    workersAworkersAt9t830 = [...new Set(workersAt9)];
    console.log("waitTimes: " + waitTimes.length)
    console.log("workersAt830: " + workersAt830.length)
    console.log("workersAt845: " + workersAt845.length)
    console.log("workersAt9: " + workersAt9.length)
}


a = waitTimes[0]
a


elevatorSimulation()
a = waitTimes.length
a
b = workersAt830.length
b
c = workersAt845.length
c
d = workersAt9.length
d


var total = 0;
for(var i = 0; i < waitTimes.length; i++) {
    total += waitTimes[i];
}
var avgWait = total / waitTimes.length;
avgWait

walkedTo2
walkedTo3
walkedTo4

e = walkedTo2.length
e
f = walkedTo3.length
f
g = walkedTo4.length
f









