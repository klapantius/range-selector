const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = 63;
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

const markerHeight = 18;

class Scale {
    cvs = undefined;
    height = 5;
    constructor(canvas, height) {
        this.cvs = canvas;
        this.height = height;
    }
    draw(color) {
        var ctx = this.cvs.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, this.cvs.height / 2 - this.height / 2, this.cvs.width, this.height);
    }
}

class Marker {
    cvs = undefined;
    unitWidth = 0;
    height = 0;
    position = 0;
    type = 'upper'; // upper/lower/middle

    constructor(canvas, unitWidth, height, index, type) {
        this.cvs = canvas;
        this.unitWidth = unitWidth;
        this.height = height;
        this.position = index;
        this.type = type;
        this.x = this.unitWidth * this.position;
        switch (type) {
            case 'upper':
                this.color = 'lightGreen'
                this.y = (this.cvs.height - this.height) / 2 - this.height - 1;
                break;
            case 'lower':
                this.color = 'lightBlue'
                this.y = (this.cvs.height + this.height) / 2 + 1;
                break;
            default:
                this.color = 'darkGreen'
                this.y = (this.cvs.height - this.height) / 2;
                break;
        }
    }
    draw() {
        let ctx = this.cvs.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.unitWidth, this.height);
    }
}

class Slider {
    cvs = undefined;
    unitWidth = 0;
    position = 0;
    constructor(canvas, unitWidth, initialPosition = 0, drawFunction = (x) => { }) {
        this.cvs = canvas;
        this.unitWidth = unitWidth;
        this.position = initialPosition;
        this.drawFunction = drawFunction;
    }
    draw(index = undefined, limit = 9) {                           // todo: limit evaluation function
        if (index == undefined) { index = this.position; }
        if (index > limit) { index = limit; }
        this.drawFunction(this.cvs, index);
        return index;
    }
    static lowerLimitDrawFunction(cvs, index) {
        console.log(`hello ${index}`)
        let ctx = cvs.getContext('2d');
        var x = index * this.unitWidth;
        // ctx.fillStyle = 'red';
        // ctx.fillRect(x, 1, 10, cvs.height-2)
        ctx.beginPath();
        ctx.moveTo(x, 1);
        ctx.lineTo(x, cvs.height-5);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red"
        ctx.stroke();
    }
}

class DataPoint {
    constructor(title, type) {
        this.title = title;
        this.type = type;
    }
}

class RangeSelector {
    items = [];
    cvs = undefined;
    label = undefined;
    markers = [];
    scale = undefined;
    unitWidth = 0;
    lowerLimit = undefined;

    constructor(items, canvas, tooltip) {
        this.items = items;
        this.cvs = canvas;
        this.label = tooltip;

        this.scale = new Scale(canvas, canvas.height / 4);
        let idx = 0;
        this.unitWidth = this.cvs.width / (this.items.length - 1);
        this.markers = this.items.map(i => new Marker(canvas, this.unitWidth, this.scale.height, idx++, i.type));
        this.lowerLimit = new Slider(this.cvs, this.unitWidth, 1, Slider.lowerLimitDrawFunction);

        this.cvs.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove = function (event) {
        this.draw();
        this.updateLabel(event);
        new Marker(
            this.cvs,
            this.unitWidth,
            this.scale.height - 2,
            this.pointToIndex(event.x),
            'middle'
        ).draw('lightgrey');
        this.lowerLimit.draw();
    }

    pointToIndex(x) { return Math.floor(x / this.unitWidth); }

    updateLabel(event) {
        let idx = this.pointToIndex(event.x);
        this.label.innerText = this.items[idx].title;
        const maxWidth = 50;
        this.label.style.position = 'absolute';
        this.label.style.left = (event.x < window.innerWidth - maxWidth) ? event.x + 'px' : window.innerWidth - maxWidth;
        this.label.style.top = event.y + 'px';
    }

    draw() {
        this.scale.draw('green');
        this.markers.map(m => m.draw());
        this.lowerLimit.draw();

        // drawMark(new Marker(idx));
        // lowerLimit.draw(position, 99);
    }
}

let rangeSelector = new RangeSelector(
    [...Array(9).keys()].map(i => new DataPoint(`24050${i}`, i % 3 == 0 ? 'upper' : 'lower')),
    document.getElementById('c2'),
    document.getElementById('itemName')
);
rangeSelector.draw();
