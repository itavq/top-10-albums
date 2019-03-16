var data = require("./staticData");

var counter = 0;

function step() {
    counter++;
}

function getRank(index) {
    return data.ranking[index][counter].r;
}

function getVal(index){
    return data.ranking[index][counter].d;
}

module.exports = { step : step,
                    getRank : getRank,
                    getVal : getVal};