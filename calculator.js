class KeyValuePairElement {
    title = 'my title';
    valueElement = undefined;
    htmlElement = undefined;

    constructor(title) {
        const label = document.createElement('span');
        const labelContent = document.createTextNode(`${title}: `);
        label.appendChild(labelContent);

        this.valueElement = document.createElement('span');
        const valueContent = document.createTextNode('n/a');
        this.valueElement.appendChild(valueContent);

        this.htmlElement = document.createElement('span');
        this.htmlElement.appendChild(label);
        this.htmlElement.appendChild(this.valueElement);
    }

    update = (newValue) => {
        this.valueElement.innerText = newValue;
    }
}

class Calculator {
    myDiv = undefined;
    startDate = undefined;
    endDate = undefined;
    result = undefined;
    lowIndex = 0;
    highIndex = 0;
    items = [];

    constructor(container, items) {
        this.items = items;

        this.myDiv = container;

        this.startDate = new KeyValuePairElement('Start date');
        this.myDiv.appendChild(this.startDate.htmlElement);

        this.addSpacing();
        this.endDate = new KeyValuePairElement('End date');
        this.myDiv.appendChild(this.endDate.htmlElement);

        this.addSpacing();
        this.result = new KeyValuePairElement('Ratio');
        this.myDiv.appendChild(this.result.htmlElement);
    }

    addSpacing() {
        // todo: replace this spacing solution
        this.myDiv.appendChild(
            document.createElement('span').appendChild(
                document.createTextNode(' ')));
    }

    update(newLowerLimit, newUpperLimit) {
        this.lowIndex = newLowerLimit;
        this.highIndex = newUpperLimit;
        this.startDate.update(this.getTitle(this.lowIndex));
        this.endDate.update(this.getTitle(this.highIndex));
        this.calculateRatio();
    }

    getTitle(index) { return this.items[index].title; }

    calculateRatio() {
        const inrangeItems = this.items
            .filter(i => this.lowIndex <= this.items.indexOf(i)
                && this.items.indexOf(i) <= this.highIndex);
        const upperCount = inrangeItems.filter(i => i.type == 'upper').length;
        const lowerCount = inrangeItems.filter(i => i.type == 'lower').length;

        const oneProc = inrangeItems.length / 100;
        const upperProc = Math.round(upperCount / oneProc);
        const lowerProc = Math.round(lowerCount / oneProc);
        this.result.update(`${upperCount}:${lowerCount} --> ${upperProc}:${lowerProc}`);
        // const upps = this.items.filter
    }
}
