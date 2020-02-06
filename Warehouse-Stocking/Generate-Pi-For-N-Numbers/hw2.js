let startUpPi = true;



if (startUpPi === true){
    document.getElementById("warehouseSimulation").style.display = 'none';    //hide
}

let continueSimulation = false;
let sumOfN = 0;
let values = [];
let valueIndicies = [];
let simulationSpeed = 300;
let warehouseSimulationSpeed = 1500;



var time = 0;
var continueSimulationWarehouse = false;
var maxTimeInDay = 10;



var bourbonStock = Math.floor(Math.random() * 30) + 31;
var vodkaStock = Math.floor(Math.random() * 30) + 61;

var bourbonMaxStock = bourbonStock;
var vodkaMaxStock = vodkaStock;

var replenishB = 0;
var replenishV = 0;

var currentSeedB = 0;
var currentSeedV = 0;

var displayRequestB = true;
var displayRequestV = true;


const variableToString = varObj => Object.keys(varObj)[0]

//restocking function
function replenish(stockSeed, stock, maxStock, replenishAmount){
    // if there is a need to restock and its restocking day
    if (time % stockSeed === 0 && replenishAmount != 0){
        stockSeed = Math.floor(Math.random() * 4) + 1;   //change replenish time
        // amountToReplenish = maxStock - stock;
        // stock += amountToReplenish
        stock += replenishAmount
    }
    return stock;

}

//purchasing function 
function purchase(stock, maxAmount, replenishAmount, seed, type){
    //if out of stock cant take from 0
    //alternatively we could place things on backorder
    //or we could have a secrete stash (perhaps some that are old at a discount)
    if (stock <= 0){
        //print that the stock cannot be negative 
        stock = 0;
        if (type === "Bourbon"){
            editText("bourbonStock", "made customer angry and lost purchase");
        }
        if (type === "Vodka"){
            editText("vodkaStock", "made customer angry and lost purchase");
        }

    }
    //otherwise remove 10% of starting stock from current stock as a purchase
    //interesting because if you take 10% from remaining stock you limit customers
    //on the other hand a provider may want to have less on the shelf if low inventory
    else{
        if (type === "Bourbon"){
            var remove = Math.floor(Math.random() * 3) / 10;
            stock -= (maxAmount * remove);    //remove 0-20% of stock
            editText("purchasedAmountB", "Purchased: " + (remove * 100).toString() +"% or " + Math.round(maxAmount * remove) +  " bourbon stock")
        }
        if (type === "Vodka"){
            var remove = Math.floor(Math.random() * 5) / 10;
            stock -= (maxAmount * remove);    //remove 0-40% of stock
            editText("purchasedAmountV", "Purchased: " + (remove  * 100).toString() +"% or " + Math.round(maxAmount * remove) + " vodka stock")
        }
    }
    //if stock is below 60% request a restock
    //a request could be made as soon as someone takes any stock which would be very conservative
    //however you cannot have over stock so it would depened if a tightly bounded
    //amount of purchases are made on an interval
    //but having a very low stock is a bad idea unless it doesnt sell and its a waste of $
    if (stock < maxAmount * 0.6  && type === "Bourbon" && replenishAmount === 0){//&& replenishAmount > 0){
        replenishAmount = maxAmount - Math.ceil(stock);
        // displayRequestInfo(stock, replenishAmount, seed, maxAmount, type)
    }
    if (stock < maxAmount * 0.4 && type === "Vodka" && replenishAmount === 0){
        replenishAmount = maxAmount - Math.ceil(stock);
    }
    return [Math.ceil(stock), replenishAmount];
}

//display the data that is considered at the time of 
function displayRequestInfo(stock, stockA, replenishAmount, replenishAmountA, stockSeed,
    stockSeedA, maxAmount, type){
    // var stockAmount = document.getElementById(stock);
    // stockAmount.innerHTML = type + " Stock = " + stock.toString();

    var replenish = document.getElementById(replenishAmount);
    replenish.innerHTML = "Request amount: " + replenishAmountA.toString();

    var seedDayToReplenish = document.getElementById(stockSeed);
    seedDayToReplenish.innerHTML = "Request time currently could take up to: " + stockSeedA.toString() + " days.";

    var maxAmount = document.getElementById(maxAmount);
    maxAmount.innerHTML = "New " + type + " stock will be " + (stockA + replenishAmountA).toString();
}


//printer
function editText(elementID, stringToDisplay){
    var element = document.getElementById(elementID);
    element.innerHTML = stringToDisplay;
}


//Stocking simulation function
function wareHouseStocking() {
    if (time > -1){
        // initialize everything
        if (time === 0 ){
    
            //amount of time for a request to replenish the stocks
            currentSeedB = Math.floor(Math.random() * 4) + 1;
            currentSeedV = Math.floor(Math.random() * 4) + 1;
    
            editText("maxBourbon", "Quantity cannot exceed: " + bourbonMaxStock.toString());
            editText("maxVodka", "Quantity cannot exceed: " + vodkaMaxStock.toString());
            editText("bourbonStock", "Bourbon Stock = " + bourbonStock.toString());
            editText("vodkaStock", "Vodka Stock = " + vodkaStock.toString());
    
        }
        else{//everyday check if stocking day and remove stock
            // replenish stock when seed matches (arrivalTime is met)
    
            //this order is really important because restocking at the beginning of day
            //will result in a different outcome then at the end of day
            //it isnt a huge change since in the simulation everything is initialized
            //and carried out in a linear manner
            
            bourbonStock = replenish(currentSeedB, bourbonStock, bourbonMaxStock, replenishB);
            vodkaStock = replenish(currentSeedV, vodkaStock, vodkaMaxStock, replenishV);


            if (displayRequestB === false && replenishB > 0){
                replenishB = 0;
                displayRequestB = true;
                currentSeedB = Math.floor(Math.random() * 4) + 1;

                editText("bourbonMaxStock", "")
                editText("replenishB", "")
                editText("currentSeedB", "Bouron has been restocked!")
            }

            if (displayRequestV === false && replenishV > 0){
                replenishV = 0;
                displayRequestV = true;
                currentSeedV = Math.floor(Math.random() * 4) + 1;

                editText("vodkaMaxStock", "")
                editText("replenishV", "")
                editText("currentSeedV", "Vodka has been restocked!")
            }

        
            //bourbon - perform purchase and display results for
            editText("bourbonStock", "Bourbon Stock = " + bourbonStock.toString());
            var bourbonPurchase = purchase(bourbonStock, bourbonMaxStock, replenishB, currentSeedB, "Bourbon");
            bourbonStock = bourbonPurchase[0];
            replenishB = bourbonPurchase[1];

            if (replenishB > 0 && displayRequestB === true){
                displayRequestInfo("bourbonStock", bourbonStock, "replenishB", replenishB,
                 "currentSeedB", currentSeedB, "bourbonMaxStock", "Bourbon");
                displayRequestB = false;
            }
            

            //vodka - perform purchase and display results for
            editText("vodkaStock", "Vodka Stock = " + vodkaStock.toString());
            var vodkaPurchase = purchase(vodkaStock, vodkaMaxStock, replenishV, currentSeedV, "Vodka");
            vodkaStock = vodkaPurchase[0];
            replenishV = vodkaPurchase[1];

            if (replenishV > 0 && displayRequestV === true){
                displayRequestInfo("vodkaStock", vodkaStock, "replenishV", replenishV,
                 "currentSeedV", currentSeedV, "vodkaMaxStock", "Vodka");
                displayRequestV = false;
            }
        }
    
    
        time++;
        if(continueSimulationWarehouse === true){
            setTimeout(function(){
                wareHouseStocking();
            },warehouseSimulationSpeed);
        }   
        
    }

}













//Pi simulation



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



//Pi simulation function
let index = 0;
let realIndex = 0;
let firstPiIter = true;
let refitOutputBy = 75;
function showPi(){
    if (index > -1){
        var nValue = document.getElementById("nValue");
        nValue.innerHTML = "N = " + realIndex.toString();

        var caclulatedPi = document.getElementById("calculatedPi");
        sumOfN += Math.pow((-1), realIndex) / (2 * realIndex + 1);
        pi = 4 * sumOfN;

        valueIndicies.push(realIndex);
        values.push(pi);   
        piLineChart.data.datasets[0].data[index] = pi;
        piLineChart.data.labels[index] = realIndex.toString();

        piLineChart.data.datasets[1].data[index] = Math.PI;

        if (values.length > refitOutputBy){
            piLineChart.data.datasets[0].data = piLineChart.data.datasets[0].data.slice(1).slice(refitOutputBy);
            piLineChart.data.labels = piLineChart.data.labels.slice(1).slice(refitOutputBy);

            values = values.slice(1).slice(refitOutputBy);
            valueIndicies = valueIndicies.slice(1).slice(refitOutputBy);
            index = 0;
            
            piLineChart.data = piChart;

            if (firstPiIter === true){
                refitOutputBy += 50;
            }
        }
        

        piLineChart.update();
        piLineChart.render();

        caclulatedPi.innerHTML = pi.toString();

    }


    index++;
    realIndex++;
    if(continueSimulation === true){
        setTimeout(function(){
            showPi(); 
        },simulationSpeed);
    }    
}


// buttons 

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

var stopWarehouse = document.getElementById("runWareHouse");
stopWarehouse.onclick = function(){
    if(continueSimulationWarehouse === false){
        continueSimulationWarehouse = true;
        wareHouseStocking();
        var simulateWarehouse = document.getElementById("runWareHouse");
        simulateWarehouse.innerHTML = "Pend Simulation";
    }
    else{
        continueSimulationWarehouse = false;
        var simulateWarehouse = document.getElementById("runWareHouse");
        simulateWarehouse.innerHTML = "Continue Simulation";
    }
}

var speedWarehouse = document.getElementById("speedWarehouse");
speedWarehouse.onclick = function(){
    if (warehouseSimulationSpeed === 1500){
        warehouseSimulationSpeed = 3500;
        var speedWarehouse = document.getElementById("speedWarehouse");
        speedWarehouse.innerHTML = "Back to normal";
    }
    else{
        warehouseSimulationSpeed = 1500;
        var speedWarehouse = document.getElementById("speedWarehouse");
        speedWarehouse.innerHTML = "Back to slow!";
    }
}

var chooseSimulation = document.getElementById("simulationChooser");
chooseSimulation.onclick = function(){
    if (startUpPi === true){
        startUpPi = false;
        showPi();
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go to Pi Simulation";
        document.getElementById("warehouseSimulation").style.display = 'block';    //show
        document.getElementById("piSimulation").style.display = 'none';     //hide
        
        wareHouseStocking();
    }
    else{
        startUpPi = true;
        var pickedSimulation = document.getElementById("simulationChooser");
        pickedSimulation.innerHTML = "Go To Warehouse Simulation";

        document.getElementById("piSimulation").style.display = 'block';    //show
        document.getElementById("warehouseSimulation").style.display = 'none';    //hide
    }
}
