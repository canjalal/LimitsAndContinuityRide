import {Ashley } from './animate';


export function drawVertLine(x, dashed = true) {

    let ctx = this.ctx;

    let xAxis = this.scales.x
    let yAxis = this.scales.y;

    let xpos = xAxis.getPixelForValue(x);
    // console.log(xpos);
    // ctx.save();
    ctx.font = '18px sans-serif';
    if(dashed) ctx.fillText(`x = ${x.toFixed(2)}`, xpos - 18, yAxis.bottom - 10);
    ctx.beginPath();
    if(dashed) ctx.setLineDash([5, 15]);
    ctx.moveTo(xpos, yAxis.top);
    ctx.lineTo(xpos, yAxis.bottom);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
    ctx.stroke();
    // ctx.restore();
    ctx.setLineDash([]);

}

export function drawTempLines(x, y) {
// needs to be bound to a chart
    return new Promise(resolve => {
        this.update();
        setTimeout(()=> {
            drawHorizLine.call(this, y, false);
            drawVertLine.call(this, x, false);
            resolve(true);
        }, 0);
    });
}

export function drawHorizLine(y, dashed = true) {

    if(y === undefined) return false;

    let ctx = this.ctx;
    // console.log(`The context is ${ctx}`);

    let xAxis = this.scales.x
    let yAxis = this.scales.y;

    let ypos = yAxis.getPixelForValue(y);
    // console.log(xpos);
    // ctx.save();
    ctx.font = '18px sans-serif';
    if(dashed) ctx.fillText(`y = ${y.toFixed(2)}`, xAxis.left + 10, ypos - 18);
    ctx.beginPath();
    if(dashed) ctx.setLineDash([5, 15]);
    ctx.moveTo(xAxis.right, ypos);
    ctx.lineTo(xAxis.left, ypos);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
    ctx.stroke();
    // ctx.restore();
    ctx.setLineDash([]);

}
export class ClickPoint {
    constructor(mathF, x, chart, ld) { // take mathF and x value and construct data from prev fine data and current pNode
        // this.leftData = null;
        this.ld = ld;
        this.chart = chart;
        this.x = x;
        this.mathF = mathF;
        let currnode = mathF.pNode;
        while(currnode.x !== x) {
            if(currnode.next.x === x) {
                this.leftData = currnode.yValues;
            }
            currnode = currnode.next;
        }
        this.rightData = currnode.yValues;
        this.node = currnode;

        this.generaterightBar();

        this._lhL = this.findLHL();
        this._rhL = this.findRHL();
        this._fullL = this.findfullL();
        this._fValue = this.findF();
        this._isContinuous = this.isContinuous();

    }

    get lhL() {
        if(this._lhL) {
            return this._lhL.toFixed(2);

        } else {

            return "undefined";
        }
    }

    get rhL() {
        if(this._rhL) {
            return this._rhL.toFixed(2);
        } else {
            return "undefined";
        }
    }

    get fullL() {
        if(this._fullL) {
            return this._fullL.toFixed(2);
        } else {
            return "undefined";
        }
    }

    get fValue() {
        if(this._fValue) {
            return this._fValue.toFixed(2);
        } else {
            return "undefined";
        }
    }

    get continuity() {
        if(this._isContinuous) {
            return "continuous";
        } else {
            return "not continuous";
        }
    }

    generateLI(id, innerText, parent, callback) { // edit to instead have the name of a method of Ashley
        const newLI = document.createElement('li');

        newLI.id = id;
        newLI.innerText = innerText;
        newLI.addEventListener('click', callback);
        parent.appendChild(newLI);
    }

    generateLIandEventHandler(id, innerText, parent, msgcallback, methodName) { // edit to instead have the name of a method of Ashley
        const newLI = document.createElement('li');
        const statusBar = document.getElementById('status-bar');

        newLI.id = id;
        newLI.innerText = innerText;

        if(methodName) {
            newLI.addEventListener('click', (event) => {
                parent.style.display = 'none';
                // console.log(this.lhL);
                statusBar.innerText = msgcallback();
                const a = new Ashley(0, 0, this.chart, this.ld);
                a[methodName](this).then((res) => {
                    a.destroy();
                    this.chart.update();
                    parent.style.display = 'flex';
                })
            });
        }
        parent.appendChild(newLI);

    }

    generaterightBar() {

        const statusBar = document.getElementById('status-bar');
        const newRightBar = document.createElement('ul');
        newRightBar.className = 'right-bar';

        this.generateLIandEventHandler('ptLabel',
         `x = ${this.x}`, newRightBar);

        this.generateLIandEventHandler('lhLimit',
         'Left-hand Limit', newRightBar,
          () => `At x = ${this.x}, the left-handed limit is ${this.lhL}`,
           'animatelhL');

        this.generateLIandEventHandler('rhLimit',
         'Right-hand Limit', newRightBar,
          () => `At x = ${this.x}, the right-handed limit is ${this.rhL}`,
           'animaterhL');

        this.generateLIandEventHandler('fullLimit',
        'Full Limit', newRightBar,
        () => `At x = ${this.x}, the full limit is ${this.fullL}`,
        'animatefullL');
    

        this.generateLIandEventHandler('funcValue',
        'Function Value', newRightBar,
         () => `At x = ${this.x}, the function value is ${this.fValue}`,
         'animateFuncValue');

        this.generateLIandEventHandler('continuity',
        'Continuity', newRightBar,
         () => `At x = ${this.x}, the function is ${this.continuity}`,
         'animateContinuity');

        const parentDiv = document.getElementsByClassName("full-size")[0];

        parentDiv.insertBefore(newRightBar, document.getElementsByClassName("preview-right")[0]);
    }

    findLHL() {
        if(this.node.type === 'vertAsymp') {
            // console.log(`${this.leftData[this.leftData - 2]} then ${this.leftData[this.leftData - 1]}`);
            if(this.leftData[this.leftData.length - 1] > this.leftData[this.leftData.length - 2] + 1) return Infinity;
            if(this.leftData[this.leftData.length - 1] < this.leftData[this.leftData.length - 2] - 1) return -Infinity;
            if(Math.abs(this.leftData[this.leftData.length - 1] - this.leftData[this.leftData.length - 2]) < 0.1) return this.node.yunFilled;
        } else if(this.node.type === 'regular') {
            let prevnode = this.mathF.pNode;

            while(prevnode.next.x !== this.node.x) {
                prevnode = prevnode.next;
            }
            // console.log(prevnode);

            if(prevnode.type === 'blankGap') {
                return null;
            }
            return this.node.y;
        } else if(this.node.type === 'removeable') {
            return this.node.yunFilled;
        } else if(this.node.type === 'jumpDisc') {
            return this.node.yFilled;
        } else if(this.node.type === 'blankGap') {
            return this.node.yunFilled;
        }
    }

    findRHL() {
        if(this.node.type === 'vertAsymp') {
            if(this.rightData[1] > this.rightData[2]) return Infinity;
            if(this.rightData[1] < this.leftData[2]) return -Infinity;
            // if(Math.abs(this.leftData[this.leftData - 1] - this.leftData[this.leftData - 2]) < 0.1) return this.yunFilled;
        } else if(this.node.type === 'regular') {
            return this.node.y;
        } else if(this.node.type === 'removeable') {
            return this.node.yunFilled;
        } else if(this.node.type === 'jumpDisc') {
            return this.node.yunFilled;
        } else if(this.node.type === 'blankGap') {
            return null;
        }
    }

    findfullL() {
        let leftL = this.findLHL();
        let rightL = this.findRHL();

        if(leftL === rightL) return leftL;
        return null;
    }

    findF() {
        if(!this.node.yFilled) return null;
        return this.node.yFilled;

    }

    isContinuous() {
        // if(this.findfullL() === null || this.findF() === null) return false;
        return (!!this.findfullL() && (this.findfullL() === this.findF()));
    }
}