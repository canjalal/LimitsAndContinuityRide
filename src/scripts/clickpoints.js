import {Ashley } from './animate';


export function drawVertLine(x, thickLines = false) {

    let ctx = this.ctx;

    let xAxis = this.scales.x
    let yAxis = this.scales.y;

    let xpos = xAxis.getPixelForValue(x);
    // console.log(xpos);
    ctx.save();
    ctx.font = '18px sans-serif';
    ctx.fillText(`x = ${x}`, xpos - 18, yAxis.bottom - 10);
    ctx.beginPath();
    ctx.setLineDash(thickLines ? [10, 10] : [8, 12]);
    ctx.moveTo(xpos, yAxis.top);
    ctx.lineTo(xpos, yAxis.bottom - 32);
    ctx.lineWidth = thickLines ? 4 : 2;
    ctx.strokeStyle = thickLines ? 'rgb(0, 100, 0)' : 'rgba(104, 1, 104)';
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
    ctx.fillText(`y = ${y.toFixed(2)}`, xAxis.left + 10, ypos - 18);
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(xAxis.right, ypos);
    ctx.lineTo(xAxis.left, ypos);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgb(0, 100, 0)';
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);

}
export class ClickPoint {
    constructor(mathF, x, chart) { // take mathF and x value and construct data from prev fine data and current pNode
        // this.leftData = null;

        this.chart = chart;
        this.x = x; // x and y are stored in this.node
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
        newLI.innerHTML = `<span>${innerText}</span>
        <p></p>`;
        // if(window.innerWidth < 900) {
        //     newLI.style.backgroundImage = 'none';
        // }

        if(methodName) {
            newLI.addEventListener('click', (event) => {
                // console.log(this.lhL);
                parent.style.display = 'none';
                statusBar.innerText = msgcallback(); // future LaTeX equation display
                const a = new Ashley(this.node.x, this.node.y, this.chart);
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

        newRightBar.addEventListener('mousedown', (event) => {
            // console.log(event.target.parent);
            let item = event.target.tagName === "LI" ? event.target : event.target.parentElement;
                item.style.left  = `1vw`;
                item.style.top = `1vw`;
              // item.style.backgroundColor = 'green';
                item.style.boxShadow = "none";

        });
      
        newRightBar.addEventListener('mouseup', (event) => {
      
          let item = event.target.tagName === "LI" ? event.target : event.target.parentElement;
            item.style.left = `0vw`;
            item.style.top = `0vw`;
            if(item.tagName === "LI") item.style.boxShadow = "1vw 1vw gray";

        });

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