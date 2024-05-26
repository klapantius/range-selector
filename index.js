class Scale {
    cvs = undefined;
    height = 5;
    constructor(canvas, height) {
        this.cvs = canvas;
        this.height = height;
    }
    draw(color) {
        const ctx = this.cvs.getContext('2d');
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
    position = 0; // index (0..n) where the slider points to
    drawFunction = () => { };
    isInRange = (_) => true;
    changedCallback = () => undefined;
    isMoving = false;
    myX = 0;
    myGrabbingRadius = 0;

    constructor(canvas, unitWidth, initialPosition = 0, drawFunction = (x) => { }, limitFunction = () => 5, changedCallback = () => undefined) {
        this.cvs = canvas;
        this.unitWidth = unitWidth;
        this.myGrabbingRadius = this.unitWidth / 3;
        this.position = initialPosition;
        this.drawFunction = drawFunction;
        this.isInRange = limitFunction;
        this.changedCallback = changedCallback;

        this.cvs.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.cvs.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.cvs.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        if (!(this.myX - this.myGrabbingRadius <= event.x && event.x <= this.myX + this.myGrabbingRadius)) { return; }
        this.isMoving = true;
    }

    onMouseMove(event) {
        if (!this.isMoving) { return; }
        const idx = Math.floor((event.x - RangeSelector.getOffset(this.cvs)) / this.unitWidth);
        const updatedPosition = this.draw(idx);
        if (updatedPosition !== this.position) {
            this.position = updatedPosition;
            this.changedCallback(this.position);
        }
    }

    onMouseUp(event) {
        if (!this.isMoving) { return; }
        this.isMoving = false;
    }

    draw(index = undefined) {
        if (index == undefined) { index = this.position; }
        if (!this.isInRange(index)) { return this.position; }
        this.myX = this.drawFunction(this.cvs, index) + RangeSelector.getOffset(this.cvs);
        return index;
    }

    static lowerLimitDrawFunction(cvs, index) {
        const x = index * this.unitWidth;
        Slider.drawSlider(cvs, x);
        return x;
    }

    static upperLimitDrawFunction(cvs, index) {
        const x = (index + 1) * this.unitWidth;
        Slider.drawSlider(cvs, x);
        return x;
    }

    static drawSlider(cvs, x) {
        const ctx = cvs.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, 1);
        ctx.lineTo(x, cvs.height - 5);
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
    upperLimit = undefined;

    constructor(items, canvas, tooltip) {
        this.items = items;
        this.cvs = canvas;
        this.label = tooltip;

        this.scale = new Scale(canvas, canvas.height / 4);
        let idx = 0;
        this.unitWidth = this.cvs.width / (this.items.length);
        this.markers = this.items.map(i => new Marker(canvas, this.unitWidth, this.scale.height, idx++, i.type));
        this.lowerLimit = new Slider(
            this.cvs, this.unitWidth, 0,
            Slider.lowerLimitDrawFunction,
            (x) => x <= (this.upperLimit.position ?? items.length / 2),
            this.onSliderChanged);
        this.upperLimit = new Slider(
            this.cvs, this.unitWidth, items.length - 1,
            Slider.upperLimitDrawFunction,
            (x) => x >= (this.lowerLimit.position ?? items.length / 2),
            this.onSliderChanged);

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
        this.upperLimit.draw();
    }

    onSliderChanged = () => {
        console.log(`lower: ${this.lowerLimit.position}; upper: ${this.upperLimit.position}`);
    }

    pointToIndex(x) { return Math.floor((x - RangeSelector.getOffset(this.cvs)) / this.unitWidth); }

    updateLabel(event) {
        const idx = this.pointToIndex(event.x);
        if (!this.items[idx]) { return; }
        this.label.innerText = this.items[idx].title;
        const maxWidth = 50;
        this.label.style.position = 'absolute';
        this.label.style.left = (event.x < window.innerWidth - maxWidth) ? (event.x + 5) + 'px' : window.innerWidth - maxWidth;
        this.label.style.top = (event.y + 2) + 'px';
    }

    draw() {
        const ctx = this.cvs.getContext('2d');
        ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.scale.draw('green');
        this.markers.map(m => m.draw());
        this.lowerLimit.draw();
        this.upperLimit.draw();
    }

    static getOffset(element) {
        const rect = element.getBoundingClientRect();
        return rect.left;
    }
}

let rangeSelector = new RangeSelector(
    [...Array(9).keys()].map(i => new DataPoint(`24050${i}`, i % 3 == 0 ? 'upper' : 'lower')),
    document.getElementById('canvas'),
    document.getElementById('itemName')
);
rangeSelector.draw();
