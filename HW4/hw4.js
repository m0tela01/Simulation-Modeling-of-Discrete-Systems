// import { get } from "http";

// import { runInNewContext } from "vm";

//base class for party participant


var generatedData = [0.21, 0.88, 0.37, 0.06, 0.98, 0.61, 0.89, 0.28, 0.70, 0.94, 0.46, 0.92, 0.34, 0.08, 0.79, 0.82, 0.36, 0.62, 0.27, 0.10];
var bin01 = [];
var bin02 = [];
var bin03 = [];
var bin04 = [];
var bin05 = [];
var bin06 = [];
var bin07 = [];
var bin08 = [];
var bin09 = [];
var bin10 = [];

var bins = []
function mapDataToBins(data){
    for(var i = 0; i < data.length; i++){
        if (data[i] >= 0 && data[i] < 0.1){
            bin01.push(data[i])
        }
        else if(data[i] >= 0.1 && data[i] < 0.2){
            bin02.push(data[i])
        }
        else if(data[i] >= 0.2 && data[i] < 0.3){
            bin03.push(data[i])
        }
        else if(data[i] >= 0.3 && data[i] < 0.4){
            bin04.push(data[i])
        }
        else if(data[i] >= 0.4 && data[i] < 0.5){
            bin05.push(data[i])
        }
        else if(data[i] >= 0.5 && data[i] < 0.6){
            bin06.push(data[i])
        }
        else if(data[i] >= 0.6 && data[i] < 0.7){
            bin07.push(data[i])
        }
        else if(data[i] >= 0.7 && data[i] < 0.8){
            bin08.push(data[i])
        }
        else if(data[i] >= 0.8 && data[i] < 0.9){
            bin09.push(data[i])
        }
        else{
            bin10.push(data[i])
        }
    }
    bins.push([bin01,bin02,bin03,bin04,bin05,bin06,bin07,bin08,bin09,bin10])
}





mapDataToBins(generatedData);

function calculateExpected(data, samplespace){
    return samplespace * (data.length / 100);
}

function testStatistic(o, e){
    return Math.pow((o-e), 2) / e;
}

function sumOfTestStatistic(data, samplespace){
    var xSquared = 0;
    for(var i = 0; i < data.length; i++){
        var e = calculateExpected(data[i], samplespace);
        xSquared += testStatistic(data[i].length, e);
    }
    return xSquared;
}


var xSquared = sumOfTestStatistic(bins, 20);
xSquared
var degrees = 9;
var alpha = 0.05;
var chiSquaredValue = 16.9;

var binsA = [];
var binsB = []

var binA = [2,2];
var binAA = [13];
var binAAA = [20, 22];

var binB = [1,4];
var binBB = [10,19];
var binBBB = [25];


binsA.push([binA, binAA, binAAA])
binsB.push([binB, binBB, binBBB])

var xSquaredA = sumOfTestStatistic(binsA, 5);
xSquaredA

var xSquaredB = sumOfTestStatistic(binsB, 5);
xSquaredB



mapDataToBins(generatedData);


var arrivalTime = [12, 31, 63, 95, 99, 154, 198, 221, 304, 346, 411, 455, 537];
var serviceTime = [40, 32, 55, 48, 18, 50, 47, 18, 28, 54, 40, 72, 12];


var availableServers = [1,2];


var responseTime = [{ label: "0", y: 0 }];//time to wait
var departureTime = [{ label: "0", y: 0 }];
var waitingTimes = [{ label: "0", y: 0 }];
var time = [{ label: "0", y: 0 }];

var splinechart = new CanvasJS.Chart("splineDiv", {
	theme:"light2",
	animationEnabled: true,
	title:{
		text: "Customers Being Served at a Resturant"
    },
    axisX :{
        title: "Number of Minutes Elapsed"
    },
	axisY :{
		// includeZero: false,
		title: "Time",
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
		name: "Current Waiting Time",
		dataPoints: waitingTimes
	},
	{
		type: "spline", 
		visible: true,
		showInLegend: true,
		name: "Current Response Time",
		dataPoints: responseTime
	},
	{
		type: "spline",
		visible: true,
		showInLegend: true,
		name: "Current Departure Time",
		dataPoints: departureTime
	},
	{
		type: "spline",
		visible: true,
		showInLegend: true,
		name: "time",
		dataPoints: time
	}]
});
splinechart.render();


function serveCustomer(server, arrivalTime, serviceTime, waitingTimes, responseTime, departureTime, time){
    var customerBeingServed = 0;
    
    var timer = 0;
    var waitingSerivceTimes = [];
    var servedList = [];
    var numberOfCustomers = arrivalTime.length;

    var waitTime = 0;
    var timeUnutilized = 0;
    while (servedList.length < numberOfCustomers){
        if (timer === arrivalTime[0]){
            var arrival = arrivalTime.shift();
            var service = serviceTime.shift();
            if (waitTime === 0){        // if the queue is empty
                if (waitingSerivceTimes.length > 0){
                    //if you arrive at the same time someone finished and theres people in the queue you go to the end
                    waitingSerivceTimes.push(service);
                    // now make the first person waiting get service
                    var newCustomerTime = waitingSerivceTimes.shift();
                    waitTime += newCustomerTime;
                    waitingTimes.push({ label: waitTime.toString(), y: waitTime});
                    if (customerBeingServed != 0){
                        servedList.push(customerBeingServed);
                    }
                    customerBeingServed = newCustomerTime;
                }
                else{
                    responseTime.push({ label: waitTime.toString(), y: waitTime});
                    var depTime = waitTime + service + timer;
                    departureTime.push({ label: depTime.toString(), y: depTime});
                    waitTime += service;
                    waitingTimes.push({ label: waitTime.toString(), y: waitTime});
                    if (customerBeingServed != 0){
                        servedList.push(customerBeingServed);
                    }
                    customerBeingServed = service;
                }
            }
            else{   //can not immediately process need to process for one time to be included
                waitTime -= 1;
                waitingTimes.push({ label: waitTime.toString(), y: waitTime});
                // if you arrive and its not time to be served you are in a queue
                waitingSerivceTimes.push(service);
                responseTime.push({ label: waitTime.toString(), y: waitTime});
                var depTime = waitTime + service + timer;
                departureTime.push({ label: depTime.toString(), y: depTime});
            }
        }
        else{
            if (waitTime != 0){
                waitTime -= 1;
                waitingTimes.push({ label: waitTime.toString(), y: waitTime});
            }
            // if no one is getting served and someone is queue serve them
            if (waitTime === 0 && waitingSerivceTimes.length > 0){
                var newCustomerTime = waitingSerivceTimes.shift();
                waitTime += newCustomerTime;
                waitingTimes.push({ label: waitTime.toString(), y: waitTime});
                if (customerBeingServed != 0){
                    servedList.push(customerBeingServed);
                }
                customerBeingServed = newCustomerTime;
            }
            if (waitTime === 0 && servedList.length === numberOfCustomers - 1){
                servedList.push(customerBeingServed);
            }
        }
        if (waitTime === 0){
            timeUnutilized += 1;
        }
        if (responseTime.length < timer){
            responseTime.push({ label: "0", y: 0})
        }
        // if (responseTime[responseTime.length-1].y  > 0 ){
            
        //     responseTime.push({ label: (responseTime[responseTime.length-1].y -1).toString(), y: responseTime[responseTime.length-1].y - 1})
        // }
        if (departureTime.length < timer){
            departureTime.push({ label: "0", y: 0})
        }
        timer += 1;
        time.push({label: timer.toString(), y: timer})
        splinechart.options.data[0].dataPoints = waitingTimes;
        splinechart.options.data[1].dataPoints = responseTime;
        splinechart.options.data[2].dataPoints = departureTime;
        splinechart.options.data[3].dataPoints = time;
        splinechart.render();
    }
    // if(servedList.length < numberOfCustomers){
    //     setTimeout(function(){
    //         serveCustomer();
    //     },300);
    // }  
    // return timer;
}

var departureTime = [{ label: "0", y: 0 }];
var waitingTimes = [{ label: "0", y: 0 }];

serveCustomer(availableServers, arrivalTime, serviceTime, waitingTimes, responseTime, departureTime, time)

console.log(a)


var hist = new CanvasJS.Chart("histDiv", {
    animationEnabled: true,
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title:{
        text: "Data from Excel split into subintervals"
    },
    axisY: {
        title: "Number of occurances"
    },
    data: [{        
        type: "column",  
        showInLegend: true, 
        legendMarkerColor: "grey",
        legendText: "Elements in subinterval",
        dataPoints: [      
            { y: bin01.length, label: "[0.0-0.1)" },
            { y: bin02.length, label: "[0.1-0.2)" },
            { y: bin03.length, label: "[0.2-0.3)" },
            { y: bin04.length, label: "[0.3-0.4)" },
            { y: bin05.length, label: "[0.4-0.5)" },
            { y: bin06.length, label: "[0.5-0.6)" },
            { y: bin07.length, label: "[0.6-0.7)" },
            { y: bin08.length, label: "[0.7-0.8)" },
            { y: bin09.length, label: "[0.8-0.9)" },
            { y: bin10.length, label: "[0.9-1.0)" }
        ]
    }]
});
hist.render();



// #endregion

//load the html generated in this js file when the page loads
document.onload = mapDataToBins(generatedData);