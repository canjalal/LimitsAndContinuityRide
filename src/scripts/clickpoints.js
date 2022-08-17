import {Ashley } from './animate';


export function drawVertLine(x) {

    let ctx = this.ctx;

    let xAxis = this.scales.x
    let yAxis = this.scales.y;

    let xpos = xAxis.getPixelForValue(x);
    // console.log(xpos);
    ctx.save();
    ctx.font = '18px sans-serif';
    ctx.fillText(`x = ${x}`, xpos - 18, yAxis.bottom - 10);
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(xpos, yAxis.top);
    ctx.lineTo(xpos, yAxis.bottom);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);

}

export function drawHorizLine(y) {

    let ctx = this.ctx;
    // console.log(`The context is ${ctx}`);

    let xAxis = this.scales.x
    let yAxis = this.scales.y;

    let ypos = yAxis.getPixelForValue(y);
    // console.log(xpos);
    ctx.save();
    ctx.font = '18px sans-serif';
    ctx.fillText(`y = ${y}`, ypos - 18, xAxis.left - 10);
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(xAxis.right, ypos);
    ctx.lineTo(xAxis.left, ypos);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);

}
export class ClickPoint {
    constructor(mathF, x, chart) { // take mathF and x value and construct data from prev fine data and current pNode
        // this.leftData = null;

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
        console.log(this._lhL);
        if(this._lhL) {
            return this._lhL.toFixed(2);

        } else {

            return "undefined";
        }
    }

    // set lhL(val) {
    //     this._lHL = val;
    // }

    get rhL() {
        if(this._rhL) {
            return this._rhL.toFixed(2);
        } else {
            return "undefined";
        }
    }

    // set rhL(val) {
    //     this._rHL = val;
    // }

    get fullL() {
        if(this._fullL) {
            return this._fullL.toFixed(2);
        } else {
            return "undefined";
        }
    }

    // set fullL(val) {
    //     this._fullL = val; 
    // }

    get fValue() {
        if(this._fValue) {
            return this._fValue.toFixed(2);
        } else {
            return "undefined";
        }
    }

    // set fValue(val) {
    //     this._fValue = val; 
    // }

    get continuity() {
        if(this._isContinuous) {
            return "continuous";
        } else {
            return "not continuous";
        }
    }

    // set isContinuous(val) {
    //     this._isContinuous = val; 
    // }


    generateLI(id, innerText, parent, callback) {
        const newLI = document.createElement('li');

        newLI.id = id;
        newLI.innerText = innerText;
        newLI.addEventListener('click', callback);
        parent.appendChild(newLI);
    }

    generaterightBar() {

        const statusBar = document.getElementById('status-bar');
        const newRightBar = document.createElement('ul');
        newRightBar.className = 'right-bar';

        this.generateLI('ptLabel', `x = ${this.x}`, newRightBar, (event)=> {
            statusBar.innerText = "You clicked me!";
        });

        this.generateLI('lhLimit', 'Left-hand Limit', newRightBar, (event)=> {
            const a = new Ashley(0, 0, this.chart);
            a.animatelhL(this).then((res) => {
                a.destroy();
            })
            statusBar.innerText = `At x = ${this.x}, the left-handed limit is ${this.lhL}`;
        });

        this.generateLI('rhLimit', 'Right-hand Limit', newRightBar, (event)=> {
            const a = new Ashley(0, 0, this.chart);
            a.animaterhL(this).then((res) => {
                a.destroy();
            });
            statusBar.innerText = `At x = ${this.x}, the right-handed limit is ${this.rhL}`;
        });

        this.generateLI('fullLimit', 'Full Limit', newRightBar, (event)=> {
            const a = new Ashley(0, 0, this.chart);
            a.animatefullL(this).then((res)=> {
                a.destroy();
            });
            statusBar.innerText = `At x = ${this.x}, the full limit is ${this.fullL}`;
        });

        this.generateLI('funcValue', 'Function Value', newRightBar, (event)=> {
            const a = new Ashley(0, 0, this.chart);
            a.animateFuncValue(this).then((res) => {
                a.destroy();
            });
            statusBar.innerText = `At x = ${this.x}, the function value is ${this.fValue}`;
        });

        this.generateLI('continuity', 'Continuity', newRightBar, (event)=> {
            const a = new Ashley(0, 0, this.chart);
            a.animateContinuity(this).then((res) => {
                a.destroy();
            });
            statusBar.innerText = `At x = ${this.x}, the function is ${this.continuity}`;
        });

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
            return this.node.y;
        } else if(this.node.type === 'removeable') {
            return this.node.yunFilled;
        } else if(this.node.type === 'jumpDisc') {
            return this.node.yFilled;
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