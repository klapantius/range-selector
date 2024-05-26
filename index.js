const calculator = new Calculator(document.getElementById('calculator'));

const rangeSelector = new RangeSelector(
    [...Array(9).keys()].map(i => new DataPoint(`24050${i}`, i % 3 == 0 ? 'upper' : 'lower')),
    document.getElementById('rangeSelector').getElementsByTagName('canvas')[0],
    document.getElementById('rangeSelector').getElementsByTagName('span')[0],
    updateCalculatorOnRangeChange
);
rangeSelector.draw();

function updateCalculatorOnRangeChange(lowerLimit, upperLimit) {
    calculator.update(lowerLimit, upperLimit);
}