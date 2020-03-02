// import { runInNewContext } from "vm";

let startUpTank = true;
let continueSimulation = false;

//calculate area of tank
function calculateArea(area, height, dt, fluidIn, fluidOut){
    var newArea = 0;
    var newHeight = 0;
    newArea = area - (fluidOut - fluidIn) / height;//(height / dt);
    newHeight = height - (fluidOut - fluidIn) / newArea; //* newArea / Math.abs(fluidIn - fluidOut);
    return [newArea, newHeight];
}

var a1 = Math.floor(Math.random() * 100) + 40;
var h1 = Math.sqrt(a1);
var f1 = Math.floor(Math.random() * 10) + 15;

var a2 = 2 * a1;
var h2 = Math.sqrt(a2);//a2 / 4;
var f2 = Math.floor(Math.random() * 10) + 10;

var f0 = Math.floor(Math.random() * 10);

let tankSimulationSpeed = 1500;

var time = 0;


// if (startUpTank === true){
//     document.getElementById("warehouseSimulation").style.display = 'none';    //hide
// }

//printer
function editText(elementID, stringToDisplay){
    var element = document.getElementById(elementID);
    element.innerHTML = stringToDisplay;
}



function doTankSimulation(){
    if (time > -1){
        if(time == 0){
            editText("deltaT", "Current Time: " + time.toString());



            editText("areaTank1", "Area of Tank = " + (Math.round(a1 * 100)/100).toString());
            editText("heightTank1", "Height of fluid = " + (Math.round(h1 * 100)/100).toString());
            editText("flow1", "Flow Rate = " + (Math.round(f1 * 100)/100).toString());

            editText("areaTank2", "Area of Tank = " + (Math.round(a2 * 100)/100).toString());
            editText("heightTank2", "Height of fluid = " + (Math.round(h2 * 100)/100).toString());
            editText("flow2", "Flow Rate = " + (Math.round(f2 * 100)/100).toString());

            editText("flow3", "Flow out Rate = " + (Math.round(f0 * 100)/100).toString());

        }
        else{
            editText("deltaT", "Current Time: " + time.toString());

            var tank1 = calculateArea(a1, h1, time, f1, f2)
            a1 = tank1[0];
            h1 = tank1[1]
            var tank2 = calculateArea(a2, h2, time, f2, f0)
            a2 = tank2[0];
            h2 = tank2[1];

            editText("areaTank1", "Area of Tank = " + (Math.round(a1 * 100)/100).toString());
            editText("heightTank1", "Height of fluid = " + (Math.round(h1 * 100)/100).toString());
            editText("flow1", "Flow Rate = " + (Math.round(f1 * 100)/100).toString());

            editText("areaTank2", "Area of Tank = " + (Math.round(a2 * 100)/100).toString());
            editText("heightTank2", "Height of fluid = " + (Math.round(h2 * 100)/100).toString());
            editText("flow2", "Flow Rate = " + (Math.round(f2 * 100)/100).toString());

            editText("flow3", "Flow out Rate = " + (Math.round(f0 * 100)/100).toString());
        }

        time++;
        if(continueSimulation === true){
            setTimeout(function(){
                doTankSimulation();
            },tankSimulationSpeed);
        }  
    }
}

// buttons 
var stopSimulation = document.getElementById("visualize");
stopSimulation.onclick = function(){
    if (continueSimulation === false){
        continueSimulation = true;
        doTankSimulation();
        var simulateButton = document.getElementById("visualize");
        simulateButton.innerHTML = "Pend Simulation";
    }
    else{
        continueSimulation = false;
        var simulateButton = document.getElementById("visualize");
        simulateButton.innerHTML = "Continue Simulation";
    }
}

var simulatedSpeed = document.getElementById("speed");
simulatedSpeed.onclick = function(){
    if (tankSimulationSpeed === 1500){
        tankSimulationSpeed = 2500;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to normal";
    }
    else{
        simulationSpeed = 1500;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to slow!";
    }
}


var chooseSimulation = document.getElementById("simulationChooser");
chooseSimulation.onclick = function(){
    if (startUpTank === true){
        startUpTank = false;
        doTankSimulation();
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go to Pi Simulation";
        document.getElementById("warehouseSimulation").style.display = 'block';    //show
        document.getElementById("piSimulation").style.display = 'none';     //hide
        
        wareHouseStocking();
    }
    else{
        startUpTank = true;
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go To Warehouse Simulation";
        doTankSimulation();

        document.getElementById("piSimulation").style.display = 'block';    //show
        document.getElementById("warehouseSimulation").style.display = 'none';    //hide
    }
}
