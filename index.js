const items = [...Array(9).keys()].map(i => new DataPoint(`24050${i}`, i % 3 == 0 ? 'upper' : 'lower'))

const calculator = new Calculator(document.getElementById('calculator'));

const rangeSelector = new RangeSelector(
    items,
    document.getElementById('rangeSelector').getElementsByTagName('canvas')[0],
    document.getElementById('rangeSelector').getElementsByTagName('span')[0],
    updateCalculator
);
rangeSelector.draw();
calculator.update(getTitle(rangeSelector.lowerLimit.position), getTitle(rangeSelector.upperLimit.position));

function updateCalculator(lowerLimit, upperLimit) {
    calculator.update(getTitle(lowerLimit), getTitle(upperLimit));
}

function getTitle(index) { return items[index].title; }