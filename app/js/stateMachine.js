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

function exceeded() {
    return counter >= data.ranking[0].length;
}

module.exports = { step : step,
                    getRank : getRank,
                    getVal : getVal,
                    exceeded: exceeded};