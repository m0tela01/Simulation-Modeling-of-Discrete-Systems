let startUpPi = true;

let continueSimulation = false;
let sumOfN = 0;
let values = [];
let valueIndicies = [];
let simulationSpeed = 300;
let warehouseSimulationSpeed = 500;



var time = 0;
var continueSimulationWarehouse = true;
var maxTimeInDay = 10;



let bourbonStock = Math.floor(Math.random() * 30) + 31;
let vodkaStock = Math.floor(Math.random() * 30) + 51;

let bourbonMaxStock = bourbonStock;
let vodkaMaxStock = vodkaStock;

let replenishB = 0;
let replenishV = 0;

var currentSeedV = 0;
var currentSeedB = 0;


function replenish(stockSeed, stock, replenishAmount){
    // if there is a need to restock and its restocking day
    if (time % stockSeed === 0 && replenishAmount != 0){
        stockSeed = Math.floor(Math.random() * 4) + 1;   //change replenish time
        amountToReplenish = totalAmount - stock;
        stock += amountToReplenish
    }

}

function purchase(stock, maxAmount, replenishAmount, seed, type){
    //if out of stock cant take from 0
    //alternatively we could place things on backorder
    //or we could have a secrete stash (perhaps some that are old at a discount)
    if (stock <= 0){
        //print that the stock cannot be negative 
        stock = 0;
    }
    //otherwise remove 10% of starting stock from current stock as a purchase
    //interesting because if you take 10% from remaining stock you limit customers
    //on the other hand a provider may want to have less on the shelf if low inventory
    else{
        stock -= maxAmount * 0.1;    //remove 10% of stock to see the effect on random restocking days
    }
    //if stock is below 60% request a restock
    //a request could be made as soon as someone takes any stock which would be very conservative
    //however you cannot have over stock so it would depened if a tightly bounded
    //amount of purchases are made on an interval
    //but having a very low stock is a bad idea unless it doesnt sell and its a waste of $
    if (stock < maxAmount * 0.6 && replenishAmount > 0){
        replenishAmount = maxAmount - stock;
        displayRequestInfo(stock, replenishAmount, seed, maxAmount, type)
    }
}

//display the data that is considered at the time of 
function displayRequestInfo(stock, replenishAmount, stockSeed, maxAmount, type){
    // var stockAmount = document.getElementById(stock);
    // stockAmount.innerHTML = type + " Stock = " + stock.toString();

    var replenish = document.getElementById(replenishAmount);
    replenish.innerHTML = "Request amount: " + replenishAmount.toString();

    var seedDayToReplenish = document.getElementById(stockSeed);
    seedDayToReplenish.innerHTML = "Request time will take: " + stockSeed.toString();

    var maxAmount = document.getElementById(maxAmount);
    maxAmount.innerHTML = "New " + type + " stock will be " + (stock + replenishAmount).toString();
}

function editText(elementID, stringToDisplay){
    var element = document.getElementById(elementID);
    element.innerHTML = stringToDisplay;
}




function wareHouseStocking() {
    if (time > -1){
        // initialize everything
        if (time === 0 ){
    
            //amount of time for a request to replenish the stocks
            currentSeedB = Math.floor(Math.random() * 4) + 1;
            currentSeedV = Math.floor(Math.random() * 4) + 1;
    
            editText("bourbonStock", "Bourbon Stock = " + bourbonStock.toString());
            editText("vodkaStock", "Vodka Stock = " + vodkaStock.toString());
    
        }
        else{//everyday check if stocking day and remove stock
            // replenish stock when seed matches (arrivalTime is met)
    
            //this order is really important because restocking at the beginning of day
            //will result in a different outcome then at the end of day
            //it isnt a huge change since in the simulation everything is initialized
            //and carried out in a linear manner
            replenish(currentSeedB, bourbonStock, 100);
            replenish(currentSeedV, vodkaStock, 100);
    
    
            editText("bourbonStock", "Bourbon Stock = " + bourbonStock.toString());
            purchase(bourbonStock, bourbonMaxStock, replenishB, currentSeedB, "Bourbon");
            
            
            editText("vodkaStock", "Vodka Stock = " + vodkaStock.toString());
            purchase(vodkaStock, vodkaMaxStock, replenishV, currentSeedV, "Vodka");
            
            
        }
    
    
        time++;
        if(continueSimulationWarehouse === true){
            setTimeout(function(){
                wareHouseStocking();
            },warehouseSimulationSpeed);
        }   
        
    }

}



















// The chart element
var myChart = document.getElementById('myChart').getContext('2d');

// chart data and characteristics
var piChart = {
    labels: valueIndicies,
    xAxisID: "X axis",
    
    datasets: [{
        label: 'Value of Pi at N',
        backgroundColor: 'rgb(113, 238, 184)',
        pointBorderWidth: 2,
        pointHoverRadius: 3,
        pointRadius: 2,
        pointHitRadius: 3,
        borderColor: 'rgb(0,0,0)',
        data: values,
    },
    {
        label: 'Pi From Math Library',
        fill: false,
        backgroundColor: 'rgb(1, 1, 205)',
        borderColor: 'rgb(1, 1, 205)',
        data: [Math.PI]
    }],
};

// chart options
var piChartOptions = {
    responsive: true,
    showLines: true,
    legend: {
        reverse: true
    },
    // plugins: {
    //     zoom: {
    //           pan: {
    //               enabled: true,
    //               mode: 'xy'
    //               },
    //           zoom: {
    //               enabled: true,
    //               mode: 'x'
    //               }
    //            },
    //         }
};

// chart annotations
var piChartAnno = {
    annotations: [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 3,
        borderColor: 'rgb(0,0,0)',
        borderWidth: 3.1,
        label: {
          enabled: true,
          content: 'This is about PI'
        }
      }]
};

// the instance of line chart
var piLineChart = Chart.Line(myChart,{

    data: piChart,
    
    options: piChartOptions,
    // annotation: piChartAnno,
});




let index = 0;
function showPi(){
    if (index > -1){
        var nValue = document.getElementById("nValue");
        nValue.innerHTML = "N = " +index.toString();

        var caclulatedPi = document.getElementById("calculatedPi");
        sumOfN += Math.pow((-1), index) / (2 * index + 1);
        pi = 4 * sumOfN;

        valueIndicies.push(index);
        values.push(pi);   
        piLineChart.data.datasets[0].data[index] = pi;
        piLineChart.data.labels[index] = index.toString();

        piLineChart.data.datasets[1].data[index] = Math.PI;
        piLineChart.update();
        piLineChart.render();

        caclulatedPi.innerHTML = pi.toString();
    }


    index++;
    if(continueSimulation === true){
        setTimeout(function(){
            showPi(); 
        },simulationSpeed);
    }    
}

var stopSimulation = document.getElementById("visualize");
stopSimulation.onclick = function(){
    if (continueSimulation === false){
        continueSimulation = true;
        showPi();
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
    if (simulationSpeed === 300){
        simulationSpeed = 50;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to normal";
    }
    else{
        simulationSpeed = 300;
        var simulatedSpeed = document.getElementById("speed");
        simulatedSpeed.innerHTML = "Back to fast!";
    }
}







var chooseSimulation = document.getElementById("simulationChooser");
chooseSimulation.onclick = function(){
    if (startUpPi === false){
        startUpPi = true;
        showPi();
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go To Warehouse Simulation";
    }
    else{
        startUpPi = false;
        wareHouseStocking();
        var pickedSimulation = document.getElementById("simulationChooser");
        chooseSimulation.innerHTML = "Go to Pi Simulation";
    }
}
