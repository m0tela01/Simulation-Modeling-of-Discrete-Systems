// import { get } from "http";

// import { runInNewContext } from "vm";

//base class for party participant
class PartyAnimal{
    constructor(id, color="rgb(0,0,0)", partnerId = -1, heardRumor = false, rumorsHeard = 0, rumorStarter = false, spreadRumor = true){
        this.id = id;
        this.color = color;
        this.partnerId = partnerId;
        this.heardRumor = heardRumor;
        this.rumorsHeard = rumorsHeard;
        this.rumorStarter = rumorStarter;
        this.spreadRumor = spreadRumor;
    }
}

//round an output to two decimals
function rounder(number){
    return (Math.round(number * 100)/100);
}

// get a random number between two values
function randomInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// ensure we have an acceptable number of people
function getPartyPeople(count){
    // let count = Math.floor(Math.random() * 10000);
    // if (count > 10000){
    //     count = 10000;
    // }
    if (count % 2 === 0){
        count -= 1;
    }
    // if (count < 2){
    //     count = 2;
    // }
    return count;
}

// create a list of Partyanimals
function createPartyAnimals(numOfPeople){
    let tracking = new Array();
    var seed = Math.floor(numOfPeople / 4);
    if (seed % 2 !== 0){
        seed + 1;
    }

    for (var i = 2; i < numOfPeople; i++){
        if (i === seed){
            tracking.push(new PartyAnimal(id=i, color="rgb(113,235,180)", heardRumor=true, rumorsHeard=1, rumorStarter=true, spreadRumor=true));
        }
        tracking.push(new PartyAnimal(i))
    }
    return tracking;
}

//randomly assign unique pairs 
function pairUp(people){
    if (people.length % 2 === 0) {
        var arr1 = people.slice(),
            arr2 = people.slice();
        
        arr1.sort(function() { return 0.5 - Math.random();});
        arr2.sort(function() { return 0.5 - Math.random();});
        
        while (arr1.length) {
            var person1 = arr1.pop(),
                person2 = arr2[0] == person1 ? arr2.pop() : arr2.shift();
            person1.partnerId = person2.id;
            person2.partnerId = person1.id;
        }
    }
}

//perform the rumor sharing operation
function spreadRumors(people){
    people.forEach(person => {
        if (person.heardRumor){     //if you have heard the rumor
            let partner = people.filter(p => p.id === person.partnerId)[0];    //get partner
            if (Math.floor(Math.random() * 2) + 1 === 1){       //given a 50/50 chance
                if (partner.spreadRumor === true){    //and your partner has not heard it twice
                    partner.rumorsHeard += 1;      //tell your parter again if they havent already
                    partner.heardRumor = true;     //track who has heard the rumor
                    partner.color = "rgb(113,235,180)";
                    if(partner.rumorsHeard === 2){
                        partner.spreadRumor = false;
                    }
                }
            }
        }
    });
}

//assumption a rummor takes 1 minute to be share with a partner
function party(people, minutes){
    for (var i = 0; i < minutes; i++){
        pairUp(people);
        spreadRumors(people);
    }
}

// let numOfPartyPeople = getPartyPeople();
// numOfPartyPeople
// let rawPeople = assignId(numOfPartyPeople);
// party(rawPeople, 5);
// let rumorers = rawPeople.filter(person => person.heardRumor === true)
// rumorers

// numOfPartyPeople
// let percentHeard = rawPeople.filter(person =>person.heardRumor === true).length/numOfPartyPeople*100;
// percentHeard

// let rumorersc = rawPeople.filter(person => person.rumorsHeard === 2)
// rumorersc


// b= rawPeople[0]
// b

// let a = rawPeople[rawPeople[0].partnerId]
// a

// q = rawPeople.length % 2
// q


//printer
function editText(elementID, stringToDisplay){
    var element = document.getElementById(elementID);
    element.innerHTML = stringToDisplay;
}


let startUp = true;
let storyText = "N students are at a party (N is an even integer 2 ≤ N ≤ 10,000). At some point, all students pair off at random and talk for exactly one minute. At the end of the minute, all students again pair off with another person at random. One student wants to start a rumor. He spreads the rumor to his conversation partner at noon. Every person who has knowledge of the rumor obeys these rules: (1). The likelihood of spreading a rumor to another person is 0.5. (2). After a person has heard the rumor 2 times, he/she will assume everyone has heard the rumor and will no longer try to spread it further."
let minutes = -1;
let simulationSpeed = 0;
let continueSimulation = false;

let simulationDuration = 0;
let numberOfPeople = 0;

let pairedPartyAnimals = [];
var plotValues = [0, 0, 0, 0];

var plotValues1 = [{ label: "0", y: 0 }];
var plotValues2 = [{ label: "0", y: 0 }];
var plotValues3 = [{ label: "0", y: 0 }];
var plotValues4 = [{ label: "0", y: 0 }];


function setDataPointsSpline(arr, time, newPoint){
    arr.push({label: time.toString(), y: newPoint})
}


// The chart element
var myChart = document.getElementById('myChart').getContext('2d');

var barchart = new CanvasJS.Chart("barPlotDiv", {
	animationEnabled: true,
	
	title:{
		text:"People Spreading Rumors at a Party"
	},
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(113,235,180,.2)",
		gridColor: "rgba(113,235,180,.1)",
		title: "Number of People"
	},
	data: [{
		type: "bar",
		name: "peoples",
		axisYType: "secondary",
		color: "rgb(113,235,180)",
		dataPoints: [
            { y: plotValues[0], label: "Has Not Heard Rumor" },
            { y: plotValues[1], label: "Heard Rumor" },
            { y: plotValues[2], label: "Heard Rumor (1)" },
            { y: plotValues[3], label: "Heard Rumor (2)" }
		]
	}]
});
barchart.render();



var splinechart = new CanvasJS.Chart("splinePlotDiv", {
	theme:"light2",
	animationEnabled: true,
	title:{
		text: "People Spreading Rumors at a Party"
    },
    axisX :{
        title: "Number of Minutes Elapsed"
    },
	axisY :{
		// includeZero: false,
		title: "Number of People",
	},
	toolTip: {
		shared: "true"
	},
	legend:{
		cursor:"pointer",
		// itemclick : toggleDataSeries
	},
	data: [{
		type: "spline",
		visible: true,
		showInLegend: true,
		name: "Has Not Heard Rumor",
		dataPoints: plotValues1
	},
	{
		type: "spline", 
		visible: true,
		showInLegend: true,
		name: "Heard Rumor",
		dataPoints: plotValues2
	},
	{
		type: "spline",
		visible: true,
		showInLegend: true,
		name: "Heard Rumor (1)",
		dataPoints: plotValues3
	},
	{
		type: "spline", 
		showInLegend: true,
		name: "Heard Rumor (2)",
		dataPoints: plotValues4
	}]
});
splinechart.render();



function doRumorsSimulation(){
    if (minutes < 1){
        if (startUp === true){
            editText("storyText", storyText);
            editText("rCountText", "Number of People at Party: ");
            editText("nMinText", "Number of Minutes: ")
            startUp = false;
        }
        else{
            numberOfPeople = document.getElementById("rumorersCount").value;
            simulationDuration = document.getElementById("Nminutes").value;
            let partyAnimals = getPartyPeople(numberOfPeople);
            pairedPartyAnimals = createPartyAnimals(partyAnimals);

            editText("afterN", "Number of minutes elapsed: " + (minutes + 1).toString());
            editText("percentN", "Heard Rumor Population : 1%");

            plotValues = [];
            plotValues = [numberOfPeople-1, 1, 1, 0];

            let newdataPoints = [
                { y: plotValues[0], label: "Has Not Heard Rumor" },
                { y: plotValues[1], label: "Heard Rumor" },
                { y: plotValues[2], label: "Heard Rumor (1)" },
                { y: plotValues[3], label: "Heard Rumor (2)" }
            ]
            barchart.options.data[0].dataPoints = newdataPoints;
            // chart.update();
            if (isBarPlot){
                barchart.render();
            }
            else{
                //need to reset because there has to be something to render initially
                plotValues1 = [];
                plotValues2 = [];
                plotValues3 = [];
                plotValues4 = [];

                setDataPointsSpline(plotValues1, minutes.toString(), plotValues[0]);
                setDataPointsSpline(plotValues2, minutes.toString(), plotValues[1]);
                setDataPointsSpline(plotValues3, minutes.toString(), plotValues[2]);
                setDataPointsSpline(plotValues4, minutes.toString(), plotValues[3]);
                
                splinechart.options.data[0].dataPoints = plotValues1;
                splinechart.options.data[1].dataPoints = plotValues2;
                splinechart.options.data[2].dataPoints = plotValues3;
                splinechart.options.data[3].dataPoints = plotValues4;
                
                splinechart.render();
            }
        }
    }
    else{
        if (minutes < simulationDuration){
            pairUp(pairedPartyAnimals);
            spreadRumors(pairedPartyAnimals);
            
            let notHeard = pairedPartyAnimals.filter(person => person.heardRumor === false).length;
            let heard = pairedPartyAnimals.filter(person => person.heardRumor === true).length;
            let heardOnce = pairedPartyAnimals.filter(person => person.rumorsHeard === 1).length;
            let heardTwice = pairedPartyAnimals.filter(person => person.rumorsHeard === 2).length;
            
            

            editText("afterN", "Number of minutes elapsed: " + (minutes + 1).toString());
            editText("percentN", "Heard Rumor Population : " + rounder((heard+1)/(numberOfPeople)*100).toString() + "%");

            plotValues = [];

            plotValues.push(notHeard);
            plotValues.push(heard);
            plotValues.push(heardOnce);
            plotValues.push(heardTwice);

            let newdataPoints = [
                { y: plotValues[0], label: "Has Not Heard Rumor" },
                { y: plotValues[1], label: "Heard Rumor" },
                { y: plotValues[2], label: "Heard Rumor (1)" },
                { y: plotValues[3], label: "Heard Rumor (2)" }
            ]
            barchart.options.data[0].dataPoints = newdataPoints;
            // chart.update();
            if (isBarPlot){
                barchart.render();
            }
            else{
                setDataPointsSpline(plotValues1, minutes.toString(), plotValues[0]);
                setDataPointsSpline(plotValues2, minutes.toString(), plotValues[1]);
                setDataPointsSpline(plotValues3, minutes.toString(), plotValues[2]);
                setDataPointsSpline(plotValues4, minutes.toString(), plotValues[3]);
                
                splinechart.options.data[0].dataPoints = plotValues1;
                splinechart.options.data[1].dataPoints = plotValues2;
                splinechart.options.data[2].dataPoints = plotValues3;
                splinechart.options.data[3].dataPoints = plotValues4;
                
                splinechart.render();                
            }

        }
        else{
            continueSimulation = false;
        }
    }

    minutes++;
    if(continueSimulation === true){
        setTimeout(function(){
            doRumorsSimulation();
        },simulationSpeed);
    }  
}

// #region buttons

//pause/play/start the simulation 
var stopSimulation = document.getElementById("visualize");
stopSimulation.onclick = function(){
    if (continueSimulation === false){
        continueSimulation = true;
        doRumorsSimulation();
        var simulateButton = document.getElementById("visualize");
        simulateButton.innerHTML = "Pend Simulation";
    }
    else{
        continueSimulation = false;
        var simulateButton = document.getElementById("visualize");
        simulateButton.innerHTML = "Continue Simulation";

    }
}

//change simulation speed
var simulatedSpeed = document.getElementById("speed");
simulatedSpeed.onclick = function(){
    if (simulationSpeed === 0){
        simulationSpeed = 1000;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to normal";
    }
    else{
        simulationSpeed = 0;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to slow!";
    }
}

var isBarPlot = false;
//change simulation plotter
var simulatedPlotter = document.getElementById("choosePlotter");
simulatedPlotter.onclick = function(){
    if (isBarPlot === false){
        isBarPlot = true;
        var simulatedPlotter = document.getElementById("choosePlotter");
        simulatedPlotter.innerHTML = "Back to Line Chart";

        document.getElementById("barPlotDiv").style.display = 'block';    //show

        document.getElementById("splinePlotDiv").style.display = 'none';    //hide
        barchart = barchart;
        barchart.render();
    }
    else{
        isBarPlot = false;
        var simulatedPlotter = document.getElementById("choosePlotter");
        simulatedPlotter.innerHTML = "Back to Bar Chart";

        document.getElementById("splinePlotDiv").style.display = 'block';    //show

        document.getElementById("barPlotDiv").style.display = 'none';    //hide
        splinechart = splinechart;
        splinechart.render();
    }
}



//referesh page
var resetPage = document.getElementById("reloadPage");
resetPage.onclick = function(){
    location.reload();
}

// #endregion

//load the html generated in this js file when the page loads
document.onload = doRumorsSimulation(); 