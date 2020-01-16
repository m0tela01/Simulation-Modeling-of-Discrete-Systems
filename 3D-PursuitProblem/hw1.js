var iterator = 1;
var coordinatess1 = [];
var coordinatess2 = [];
var continueSimulation = false;
let playingField = [10, 10, 10]

// #region Initialize
function getInitialCoordinates() {
    let resultShip1 = [];
    let resultShip2 = [];
    for (let i = 0; i < 3; i++) {
        resultShip1[i] = Math.floor(Math.random() * 10) + 1;
        resultShip2[i] = Math.floor(Math.random() * 10) + 1;
    }
    // if they are starting at the same place reset 
    if (resultShip1 === resultShip2) {
        getInitialCoordinates();
    }
    

    return [resultShip1, resultShip2];
}


function showShipTurn() {
    var x = document.getElementById("currentShipMove");
    if (iterator !== 1) {
        if (x.innerHTML === "Ship #1 Turn") {
          x.innerHTML = "Ship #2 Turn";
        } else {
          x.innerHTML = "Ship #1 Turn";
        }
    }
}
// #endregion

function stringNumbersoIntArr(numbersAsString) {
    let arrayInt = numbersAsString.split(",").map(x =>{
        return parseInt(x, 10);
    })
    return arrayInt;
}


function generateRefreshButton(){
    var refreshButton = document.createElement('button');
    refreshButton.id = "refreshButton";
    refreshButton.innerHTML = 'Refresh to Restart Game'
    refreshButton.onclick = function (){
        window.location.reload();
    };
    let refreshDiv = document.getElementById('refresh');
    refreshDiv.parentNode.insertBefore(refreshButton, refreshDiv);
}

// remove this
function getRandomCoordinates() {
    let result = [];
    let shipTurn = 0;
    for (let i = 0; i < 3; i++) {
        result[i] = Math.floor(Math.random() * 10) + 1;
    }

    if(iterator % 2 === 0) {
        shipTurn = 1;
    }
    else {
        shipTurn = 2;
    }
    return ["New Coordinates: ", result, shipTurn];
}

function computeDistance(attackShipLocation, otherShipLocation) {
    let distance = Math.sqrt(Math.pow(otherShipLocation[0] - attackShipLocation[0], 2) + Math.pow(otherShipLocation[1] - attackShipLocation[1], 2) + Math.pow(otherShipLocation[2] - attackShipLocation[2], 2));
    return distance//Math.abs(distance);
}

function computeAngle(cylindricalPoint1, cylindricalPoint2) {
    let x = cylindricalPoint1[0] - cylindricalPoint2[0];
    let y = cylindricalPoint1[1] - cylindricalPoint2[1];
    let z = cylindricalPoint1[2] - cylindricalPoint2[2];
    
    //take abs to consider half the cases
    return Math.abs(Math.atan2(y, Math.sqrt(x*x + z*z))) * 180 / Math.PI;
}


function computeCylindricalCoordinates(shipLocation) {
    let result = [];
    result[0] = Math.sqrt(Math.pow(shipLocation[0], 2) + Math.pow(shipLocation[1], 2)); //r
    result[1] = Math.atan(shipLocation[1]/shipLocation[0]);
    result[2] = shipLocation[2];
    return result;
}


// performs the ship move based on the distance and angle functions
// if either d/a does not meet the correct value ship moves randomly
// (should simulate fighting if the coordinates of the object of pursuit 
// were not known to a person watching. this removes a step for having both 
// ships reposition after a turn (this only makes sense in a mini simulation).)
function shipMove(ship1Coord, ship2Coord) {
    showShipTurn(); //toggle text next to button
    ship1Coord = computeCylindricalCoordinates(ship1Coord);
    ship2Coord = computeCylindricalCoordinates(ship2Coord);

    let distance = computeDistance(ship1Coord,ship2Coord);  //alawys try to attack at beginning of turn
    let cylindricalAngle = computeAngle(ship1Coord, ship2Coord)
    
    console.log(distance.toString()+", " +cylindricalAngle.toString());
    
    if (distance <= 5 && cylindricalAngle <= 3) {
        let rollForHit = Math.floor(Math.random() * 3) + 1;
        if (distance <= 3 && cylindricalAngle <= 2) {    //if  attacking ship is close with low angle hit
            rollForHit = 1;
        }
        if (rollForHit === 1) {
            let shipNumber = 2;
            if (iterator % 2 === 0) {
                shipNumber = 1;
            }
            return ["true", "Successful Attack!! Enemy Ship " + shipNumber.toString() + " Down!!"];
        }
        else {
            return ["false", "Missed Attack...\n", getRandomCoordinates()]
        }
    }
    else {
        return ["false", getRandomCoordinates()];
    }
}


function getShipMove(){    
    if (iterator === 1) {           // sets the initial locations
        //create run sim button
        let runSimulationButton = document.createElement('button');
        runSimulationButton.innerHTML = "Run Full Simulation";
        runSimulationButton.id = "simulationButton";
        runSimulationButton.onclick = function(){
            continueSimulation = true;
            getShipMove();//alert('here be dragons'); //getShipMove();              //change this for a forloop
        };
        document.getElementById('topButtons').appendChild(runSimulationButton);

        //adding initial locations
        let battleButton = document.getElementById('battleButton');
        battleButton.innerHTML = "Get Next Coordinates"
        
        let totalMoves = document.createElement('span');
        totalMoves.innerHTML = "Total Moves: " + iterator.toString();
        totalMoves.id = "totalMoves";
        document.getElementById('refresh').appendChild(totalMoves)

        let h3Text1 = document.createElement('h3');
        let h3Text2 = document.createElement('h3');
        let initialCoords = getInitialCoordinates();
        coordinatess1 = initialCoords[0];
        coordinatess2 = initialCoords[1];
        
        h3Text1.textContent = "Initial Location - " + coordinatess1;
        h3Text2.textContent = "Initial Location - " + coordinatess2;

        document.body.appendChild(h3Text1);
        document.body.appendChild(h3Text2);
        // iterator++;


    } else {    // any other turn

        let totalMoves = document.getElementById('totalMoves');
        totalMoves.innerHTML = "Total Moves: " + iterator.toString();
        

        let h4Text = document.createElement('h4');
        let shipData = shipMove(coordinatess1, coordinatess2);

        if (shipData[0] === "true") {             //success
            h4Text.textContent = shipData[1];
            continueSimulation = false;
            generateRefreshButton();
            document.getElementById('simulationButton').disabled = true;
            document.getElementById('battleButton').disabled = true;
        } else if (shipData.length === 3) {     //missed
            if (shipData[2][2] === 1){
                coordinatess1 = shipData[2][1]
            }
            else {
                coordinatess2 = shipData[2][1]
            }
            h4Text.textContent = shipData[1] + shipData[2][0] + shipData[2][1].toString();
        } else {                    
            if (shipData[1][2] === 1){
                coordinatess1 = shipData[1][1]
            }
            else {
                coordinatess2 = shipData[1][1]
            }              //not even close
            h4Text.textContent = shipData[1][0] + shipData[1][1].toString();
        }
        document.body.appendChild(h4Text);
    }
    iterator++;
    if (continueSimulation === true) {
        setTimeout(function(){
            getShipMove();
        },300);
    }
}

