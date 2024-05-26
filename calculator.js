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

    update = (newLowerLimit, newUpperLimit) => {
        this.startDate.update(newLowerLimit);
        this.endDate.update(newUpperLimit);
    }
}
