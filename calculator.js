class KeyValuePairElement {
    title = 'my title';
    value = 'n/a';
    htmlElement = undefined;
    
    constructor(title) {
        const label = document.createElement('span');
        const labelContent = document.createTextNode(`${title}: `);
        label.appendChild(labelContent);

        const value = document.createElement('span');
        const valueContent = document.createTextNode('n/a');
        value.appendChild(valueContent);
        
        this.htmlElement = document.createElement('span');
        this.htmlElement.appendChild(label);
        this.htmlElement.appendChild(value);
    }
}

class Calculator {
    myDiv = undefined;
    startDate = undefined;
    endDate = undefined;

    constructor(container) {
        this.myDiv = container;
        this.startDate = new KeyValuePairElement('Start date');
        // todo: replace this spacing solution
        this.myDiv.appendChild(this.startDate.htmlElement);
        this.myDiv.appendChild(
            document.createElement('span').appendChild(
                document.createTextNode(' ')));
        this.endDate = new KeyValuePairElement('End date');
        this.myDiv.appendChild(this.endDate.htmlElement);
    }
    
}

const calculator = new Calculator(document.getElementById('calculator'));