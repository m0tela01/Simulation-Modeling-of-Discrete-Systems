// import { get } from "http";

// import { runInNewContext } from "vm";

let startUpTank = true;
let continueSimulation = false;
let hrContinueSimlation = false
let softContinueSimulation = false;
let hr1 = false;
let sf1 = false;



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
var f1 = Math.floor(Math.random() * 10) + 3;

var a2 = 2 * a1;
var h2 = Math.sqrt(a2);//a2 / 4;
var f2 = Math.floor(Math.random() * 10) + 14;

var f0 = Math.floor(Math.random() * 10) + 20;

let tankSimulationSpeed = 1500;

let finish1 = true;
let finish2 = true;

var time = 0;

let intialA1 = a1;
let intialA2 = a2;
let intialH1 = h1;
let intialH2 = h2;

if (startUpTank === true){
    document.getElementById("triangleSimulation").style.display = 'none';    //hide
    document.getElementById("hrSimulation").style.display = 'none';    //hide
    document.getElementById("softwareSimulation").style.display = 'none';    //hide
}

//printer
function editText(elementID, stringToDisplay){
    var element = document.getElementById(elementID);
    element.innerHTML = stringToDisplay;
}

function rounder(number){
    return (Math.round(number * 100)/100);
}


function doTankSimulation(){
    if (time > -1){
        if(time == 0){
            editText("deltaT", "Current Time: " + time.toString());

            editText("tankName1", "Tank 1");
            editText("tankName2", "Tank 2");

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
            if (h1 <= 0){
                h1 = 0;
                a1 = 0;
                if (finish1){
                    editText("report1", "It took " + time.toString() + " intervals to empty Tank 1 with initial values for Area = " + intialA1.toString() + " and Height = " + (Math.round(intialH1 * 100)/100).toString());
                    finish1 = false;
                }
            }
            if (a1 <= 0){
                a1 = 0;
                h1 = 0;
                f1 = f1;
                if (finish1){
                    editText("report1", "It took " + time.toString() + " intervals to empty Tank 1 with initial values for Area = " + intialA1.toString() + " and Height = " + (Math.round(intialH1 * 100)/100).toString());
                    finish1 = false;
                }
                continueSimulation = false;
            }
            if (h2 <= 0){
                h2 = 0;
                a2 = 0;
                if (finish2){
                    editText("report2", "It took " + time.toString() + " intervals to empty Tank 2 with initial values for Area = " + intialA2.toString() + " and Height = " + (Math.round(intialH2 * 100)/100).toString());
                    finish2 = false;
                }
            }
            if (a2 <= 0) {
                a2 = 0;
                h2 = 0;
                f2 = f2;
                f0 = f0;
                if (finish2){
                    editText("report2", "At this rate it would have taken " + time.toString() + " intervals to empty Tank 2 with initial values for Area = " + intialA2.toString() + " and Height = " + (Math.round(intialH2 * 100)/100).toString());
                    finish2 = false;
                }
                continueSimulation = false;
            }

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

function getNum(){
    var number = 0;
    return number;
}

// function doTriangleSimulation(){
//     var ctx  = document.getElementById('myCanvas').getContext('2d');
//     var point1 = getNum();
//     var point2 = getNum();
//     var point3 = getNum();

//     ctx.fillRect(point1, point1, 4, 4);
//     ctx.fillRect(point2, point2, 4, 4);
//     ctx.fillRect(point3, point3, 4, 4);
// }


function calculateScores1(){
    var outcomes = [];
    var a = 0;
    let keyA = 3;
    var b = 0;
    let keyB = 5;

    var c = 1000000;
    let tests = 1000000;
    var overall = 0;
    for (var i = 0; i < tests; i++){
        testA = Math.ceil(Math.random() * 5);
        testB = Math.ceil(Math.random() * 5);
        if (testA === keyA){
            a++;
        }
        if (testB === keyB){
            b++;
        }

        if (testA === keyA && testB === keyB){
            overall++;
        }
    }

    outcomes.push(rounder(a/tests * 100));
    outcomes.push(rounder(b/tests * 100));
    outcomes.push(rounder(c/tests * 100));
    outcomes.push(rounder(overall/tests * 100));
    return outcomes;
}

function calculateScores2(){
    var outcomes = [];
    var a = 0;
    let keyA = 0;
    var b = 0;
    let keyB = 0;
    var c = 0;
    let keyC = 0;

    let tests = 10000000;
    var overall = 0;
    for (var i = 0; i < tests; i++){
        keyA = Math.ceil(Math.random() * 5);
        keyB = Math.ceil(Math.random() * 5);
        keyC = Math.ceil(Math.random() * 5);
        
        testA = Math.ceil(Math.random() * 5);
        testB = Math.ceil(Math.random() * 5);
        testC = Math.ceil(Math.random() * 5);
        
        
        if (testA === keyA){
            a++;
        }

        if (testB === keyB){
            b++;
        }

        if (testC === keyC){
            c++;
        }


        if (testA === keyA && testB === keyB && testC === keyC){
            overall++;
        }
    }

    outcomes.push(rounder(a/tests * 100));
    outcomes.push(rounder(b/tests * 100));
    outcomes.push(rounder(c/tests * 100));
    outcomes.push(rounder(overall/tests * 100));
    return outcomes;
}

function doHRSimulation(){
    if (hr1 === false){
        editText("test", " Taking 1,000,000 tests... ")

        editText("test2", " Taking 10,000,000 tests... ")
        hr1 = true;
        var simulateButton = document.getElementById("visualizeHr");
        simulateButton.innerHTML = "Simulation running...";
    }
    else{
        outcome = calculateScores1();
        editText("testResult", "1: " + outcome[0].toString() + "%  || 2: " + outcome[1].toString() + "%  || 3: " + outcome[2].toString() + "%");
        editText("finalGrade", "The % of applicants who passed is: " + outcome[3].toString() + "%");
    
        outcome2 = calculateScores2();
        editText("testResult2", "1: " + outcome2[0].toString() + "%  || 2: " + outcome2[1].toString() + "%  || 3: " + outcome2[2].toString() + "%");
        editText("finalGrade2", "The % of applicants who passed is: " + outcome2[3].toString() + "%");
        hrContinueSimlation = false;
        var simulateButton = document.getElementById("visualizeHr");
        simulateButton.innerHTML = "Rerun Simulation";
        hr1 = false;
    }

    if(hrContinueSimlation === true){
        setTimeout(function(){
            doHRSimulation();
        },1000);
    }
}


function findCritical(){
    
    var testP1 = 0;
    var testP2 = 0;
    var testP3 = 0;
    var testP4 = 0;
    var testP5 = 0;
    
    var outcome =[];
    
    let tests = 10000000;
    
    for(i = 0; i < tests; i++){
        // the path lengths for each trial are the same becaus we want them to be
        // related in the measurement of the same run.
        // add who wins each round but it should give the same information as 
        // we are currently gathering
        
        var l12 = Math.ceil(Math.random() * 3 + 3);
        var l15 = 6;
        var l23 = 6;
        var l24 = Math.ceil(Math.random() * 3 + 5);
        var l34 = Math.ceil(Math.random() * 5 + 3);
        var l47 = 4;
        var l53 = 8;
        var l54 = 11;
        var l56 = Math.ceil(Math.random() * 3 + 7);
        var l67 = Math.ceil(Math.random() * 2 + 8);
    
        var path1 = l12 + l23 + l34 + l47;
        var path2 = l12 + l24 + l47;
        var path3 = l15 + l53 + l34 + l47;
        var path4 = l15 + l54 + l47;
        var path5 = l15 + l56 + l67;
        
        testP1 += path1;
        testP2 += path2;
        testP3 += path3;
        testP4 += path4;
        testP5 += path5;
    }

    outcome.push(rounder(testP1));
    outcome.push(rounder(testP2));
    outcome.push(rounder(testP3));
    outcome.push(rounder(testP4));
    outcome.push(rounder(testP5));

    testP1 /= 10000000;
    testP2 /= 10000000;
    testP3 /= 10000000;
    testP4 /= 10000000;
    testP5 /= 10000000;

    outcome.push(rounder(testP1));
    outcome.push(rounder(testP2));
    outcome.push(rounder(testP3));
    outcome.push(rounder(testP4));
    outcome.push(rounder(testP5));

    // we could get all the indicies with the minimum
    // we could also order them by best path
    // we could mention which one was shorter for the best
    // we could also find which has a backup as far as additional routes if busy
    outcome.push(Math.min(...outcome));
    outcome.push(outcome.indexOf(Math.min(...outcome)) - 4);

    return outcome;
}

function doSoftwareSimulation(){
    if (sf1 === false){
        var simulateButton = document.getElementById("visualizeSoft");
        editText("softTest", "Analyzing critical paths...");
        simulateButton.innerHTML = "Simulation running...";
        editText("softResult", "Running 10,000,000 trials..");
        sf1 = true;
    }
    else{
        var outcome = findCritical();
    
        editText("softOutcome1", "   Avg. Path one   :  1 -> 2 -> 3 -> 4 -> 7    ||  " + outcome[5].toString() + "  ||  Actual Size  : " + outcome[0].toString());
        editText("softOutcome2", "   Avg. Path two   :  1 -> 2 -> 4 -> 7         ||  " + outcome[6].toString() + "  ||  Actual Size  : " + outcome[1].toString());
        editText("softOutcome3", "   Avg. Path three :  1 -> 5 -> 3 -> 4 -> 7    ||  " + outcome[7].toString() + "  ||  Actual Size  : " + outcome[2].toString());
        editText("softOutcome4", "   Avg. Path four  :  1 -> 5 -> 4 -> 7         ||  " + outcome[8].toString() + "  ||  Actual Size  : " + outcome[3].toString());
        editText("softOutcome5", "   Avg. Path five  :  1 -> 5 -> 6 -> 7         ||  " + outcome[9].toString() + "  ||  Actual Size  : " + outcome[4].toString());
        editText("softOutcomeF", "Therefore the best from my trials was: Path " + outcome[11].toString() + ". With the average length in the path having a value of: " + outcome[10].toString())
        
        var simulateButton = document.getElementById("visualizeSoft");
        simulateButton.innerHTML = "Rerun Simulation";
        softContinueSimulation = false;
        sf1 = false;
    }
    
    if(softContinueSimulation === true){
        setTimeout(function(){
            doSoftwareSimulation();
        },1000);
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

var stopSimulation = document.getElementById("visualizeHr");
stopSimulation.onclick = function(){
    if (hrContinueSimlation === false){
        hrContinueSimlation = true;
        doHRSimulation();
        var simulateButton = document.getElementById("visualizeHr");
    }
    else{
        hrContinueSimlation = false;
        var simulateButton = document.getElementById("visualizeHr");
    }
}

var stopSimulation = document.getElementById("visualizeSoft");
stopSimulation.onclick = function(){
    if (softContinueSimulation === false){
        softContinueSimulation = true;
        var simulateButton = document.getElementById("visualizeSoft");
        simulateButton.innerHTML = "Simulation running...";
        doSoftwareSimulation();
        // simulateButton.innerHTML = "Rerun Simulation";
    }
    else{
        softContinueSimulation = false;
        var simulateButton = document.getElementById("visualizeSoft");
        // simulateButton.innerHTML = "Rerun Simulation";
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
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go to Coupled Tank Simulation";
        document.getElementById("triangleSimulation").style.display = 'block';    //show

        document.getElementById("tankSimulation").style.display = 'none';     //hide
        document.getElementById("hrSimulation").style.display = 'none';    //hide
        document.getElementById("softwareSimulation").style.display = 'none';    //hide
    }
    else{
        startUpTank = true;
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go back to Triangle Simulation";

        document.getElementById("tankSimulation").style.display = 'block';    //show

        document.getElementById("triangleSimulation").style.display = 'none';    //hide
        document.getElementById("hrSimulation").style.display = 'none';    //hide
        document.getElementById("softwareSimulation").style.display = 'none';    //hide
    }
}



var hrChooser = document.getElementById("hrChooser");
hrChooser.onclick = function(){
    if (startUpTank === true){
        startUpTank = false;
        var pickedSimulation = document.getElementById("hrChooser");
        pickedSimulation.innerHTML = "Go to Coupled Tank Simulation";
        document.getElementById("hrSimulation").style.display = 'block';    //show
        
        document.getElementById("tankSimulation").style.display = 'none';     //hide
        document.getElementById("triangleSimulation").style.display = 'none';     //hide
        document.getElementById("softwareSimulation").style.display = 'none';    //hide
    }
    else{
        startUpTank = true;
        var pickedSimulation = document.getElementById("hrChooser");
        pickedSimulation.innerHTML = "Go back to HR Simulation";

        document.getElementById("tankSimulation").style.display = 'block';    //show

        document.getElementById("hrSimulation").style.display = 'none';    //hide
        document.getElementById("triangleSimulation").style.display = 'none';    //hide
        document.getElementById("softwareSimulation").style.display = 'none';    //hide
    }
}



var softwareChooser = document.getElementById("softwareChooser");
softwareChooser.onclick = function(){
    if (startUpTank === true){
        startUpTank = false;
        var pickedSimulation = document.getElementById("softwareChooser");
        pickedSimulation.innerHTML = "Go to Coupled Tank Simulation";
        document.getElementById("softwareSimulation").style.display = 'block';    //show
        
        document.getElementById("tankSimulation").style.display = 'none';     //hide
        document.getElementById("triangleSimulation").style.display = 'none';     //hide
        document.getElementById("hrSimulation").style.display = 'none';    //hide
    }
    else{
        startUpTank = true;
        var pickedSimulation = document.getElementById("softwareChooser");
        pickedSimulation.innerHTML = "Go back to Software Simulation";

        document.getElementById("tankSimulation").style.display = 'block';    //show

        document.getElementById("hrSimulation").style.display = 'none';    //hide
        document.getElementById("triangleSimulation").style.display = 'none';    //hide
        document.getElementById("softwareSimulation").style.display = 'none';    //hide
    }
}