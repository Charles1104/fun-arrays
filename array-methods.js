/*jshint esversion: 6 */

var dataset = require('./dataset.json').bankBalances;

// Get a unique array of the state concerned
var uniqueArrayState = [];

for (var i=0; i < dataset.length; i++){
  uniqueArrayState.push(dataset[i].state);
}

var uniqueArrayState = uniqueArrayState.reduce(function(p,c){
  if (p.indexOf(c) < 0){
    p.push(c);
  }
  return p;
},[]);

/*
  create an array with accounts from bankBalances that are
  greater than 100000.00
  assign the resulting array to `hundredThousandairs`
*/

var hundredThousandairs = dataset.filter(function(element){
  return parseFloat(element.amount) > 100000.00;
});


/*
  set a new key for each object in bankBalances named `rounded`
  the value of this key will be the `amount` rounded to the nearest dollar
  example
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting array to `roundedDollar`
*/
var roundedDollar = dataset.map(function(element){
  var newObj1 = {
    "amount": element.amount,
    "state": element.state,
    "rounded": Math.round(parseFloat(element.amount))
  };
  return newObj1;
});

/*
  set a the `amount` value for each object in bankBalances
  to the value of `amount` rounded to the nearest 10 cents
  example
    {
      "amount": 134758.4,
      "state": "HI"
    }
  assign the resulting array to `roundedDime`
*/

var roundedDime = dataset.map(function(element){
  var newObj2 = {
    "amount": (Math.round(parseFloat(element.amount)*10))/10,
    "state": element.state,
  };
  return newObj2;
});

// set sumOfBankBalances to the sum of all amounts in bankBalances

var sumOfBankBalances = dataset.reduce(function(prev,element){
  prev += parseFloat(element.amount);
  return (Math.round(parseFloat(prev)*100))/100;
},0);

/*
  set sumOfInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  in each of the following states
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */

var sumOfInterests = dataset.filter(function(element){
  return (element.state === "WI" || element.state === "IL" || element.state === "WY" || element.state === "OH" || element.state === "GA" || element.state === "DE");
}).reduce(function(prev,element){
  prev += parseFloat(element.amount)*0.189;
  return (Math.round(prev*100))/100;
},0);

/*
  set sumOfHighInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  where the amount of the sum of interests in that state is
    greater than 50,000
  in every state except
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */


// filter on the concerned states only
var filter_sumofhigh = dataset.filter(function(element){
  return !(element.state === "WI" || element.state === "IL" || element.state === "WY" || element.state === "OH" || element.state === "GA" || element.state === "DE");
});

//sum the interest for each state

var sumInterestByState = [];
for (let i = 0; i < uniqueArrayState.length; i++){
  var reduced_sumofhigh = filter_sumofhigh.reduce(function(prev,element){
    if(uniqueArrayState[i] === element.state){
      prev += parseFloat(element.amount)*0.189;
    }
    return prev;
  },0);

  sumInterestByState.push({"state":uniqueArrayState[i],"roundedinterest":reduced_sumofhigh});
}

var sumOfHighInterests = sumInterestByState.filter(function(element){
  return parseFloat(element.roundedinterest) > 50000.00;
}).reduce(function(prev,element){
  prev += parseFloat(element.roundedinterest);
  return (Math.round(prev*100))/100;
},0);

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table
    where the key is the two letter state abbreviation
    and the value is the sum of all amounts from that state
      the value must be rounded to the nearest cent
 */

var stateSums = {};

for (let i = 0; i < uniqueArrayState.length; i++){
var reducedBankBalance = dataset.reduce(function(prev,element){
    if(uniqueArrayState[i] === element.state){
      prev += parseFloat(element.amount);
    }
    return prev;
  },0);

  stateSums[uniqueArrayState[i]] =(Math.round(reducedBankBalance*100))/100;
}



/*
  set lowerSumStates to an array containing
  only the two letter state abbreviation of each state
  where the sum of amounts in the state is
    less than 1,000,000
 */
var lowerSumStates = [];

for (let i = 0; i < uniqueArrayState.length; i++){
var sumLowBankBalance = dataset.reduce(function(prev,element){
    if(uniqueArrayState[i] === element.state){
      prev += parseFloat(element.amount);
    }
    return prev;
  },0);

  lowerSumStates.push({[uniqueArrayState[i]] : Math.round(sumLowBankBalance*100)/100});
}

lowerSumStates = lowerSumStates.filter(function(currentObject){
  return currentObject[Object.keys(currentObject).join()] < 1000000;

});

lowerSumStates = lowerSumStates.map(function(element){
  element = Object.keys(element).join();
  return element;
  });




/*
  set higherStateSums to be the sum of
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */

var higherStateSums = [];

for (let i = 0; i < uniqueArrayState.length; i++){
var sumLowBankBalance = dataset.reduce(function(prev,element){
    if(uniqueArrayState[i] === element.state){
      prev += parseFloat(element.amount);
    }
    return prev;
  },0);

  higherStateSums.push({[uniqueArrayState[i]] : Math.round(sumLowBankBalance*100)/100});
}

higherStateSums = higherStateSums.filter(function(currentObject){
  return currentObject[Object.keys(currentObject).join()] > 1000000;
});

var higherStateSums = higherStateSums.reduce(function(prev,element){
      prev += element[Object.keys(element).join()];
      return prev;
  },0);


/*
  set areStatesInHigherStateSum to be true if
    all of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */

 var areStatesInHigherStateSum = [];

// filter on the concerned states only
var filterAreStates = dataset.filter(function(element){
  return (element.state === "WI" || element.state === "IL" || element.state === "WY" || element.state === "OH" || element.state === "GA" || element.state === "DE");
});

//sum only for the states filtered

for (let i = 0; i < uniqueArrayState.length; i++){
  var reducedFilterAreStates = filterAreStates.reduce(function(prev,element){
    if(uniqueArrayState[i] === element.state){
      prev += parseFloat(element.amount);
    }
    return prev;
  },0);

  areStatesInHigherStateSum.push({"state":uniqueArrayState[i],"sumOfAmount":reducedFilterAreStates});
}

//filter to keep only an array with the concerned states

var areStatesInHigherStateSum1 = areStatesInHigherStateSum.filter(function(element){
  return element.sumOfAmount !== 0;
});



areStatesInHigherStateSum = areStatesInHigherStateSum1.every(function(element){
  return element.sumOfAmount > 2550000;
},0);


console.log(areStatesInHigherStateSum);

/*
  Stretch Goal && Final Boss

  set anyStatesInHigherStateSum to be true if
    any of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */


var anyStatesInHigherStateSum = [];

 anyStatesInHigherStateSum = areStatesInHigherStateSum1.some(function(element){
  return element.sumOfAmount > 2550000;
},0);




module.exports = {
  hundredThousandairs : hundredThousandairs,
  roundedDollar : roundedDollar,
  roundedDime : roundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
