// const { rightBar, previewBar, imageL } = require("../index");

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
export class ClickPoint {
    constructor(mathF, x) { // take mathF and x value and construct data from prev fine data and current pNode
        // this.leftData = null;
        let currnode = mathF.pNode;
        while(currnode.x !== x) {
            if(currnode.next.x === x) {
                this.leftData = currnode.yValues;
            }
            currnode = currnode.next;
        }
        this.rightData = currnode.yValues;
        this.node = currnode;
    }

    findLHL() {
        if(this.node.type === 'vertAsymp') {
            if(this.leftData[this.leftData - 1] > this.leftData[this.leftData - 2] + 1) return Infinity;
            if(this.leftData[this.leftData - 1] < this.leftData[this.leftData - 2] - 1) return -Infinity;
            if(Math.abs(this.leftData[this.leftData - 1] - this.leftData[this.leftData - 2]) < 0.1) return this.yunFilled;
        } else if(this.node.type === 'regular') {
            return this.y;
        } else if(this.node.type === 'removeable') {
            return this.yunFilled;
        } else if(this.node.type === 'jumpDisc') {
            return this.yFilled;
        }
    }

    findRHL() {
        if(this.node.type === 'vertAsymp') {
            if(this.rightData[1] > this.rightData[2]) return Infinity;
            if(this.rightData[1] < this.leftData[2]) return -Infinity;
            // if(Math.abs(this.leftData[this.leftData - 1] - this.leftData[this.leftData - 2]) < 0.1) return this.yunFilled;
        } else if(this.node.type === 'regular') {
            return this.y;
        } else if(this.node.type === 'removeable') {
            return this.yunFilled;
        } else if(this.node.type === 'jumpDisc') {
            return this.yunFilled;
        }
    }

    findfullL() {
        let leftL = this.findLHL();
        let rightL = this.findRHL();

        if(leftL === rightL) return leftL;
        return null;
    }

    findF() {
        if(!this.yFilled) return null;
        return this.yFilled;

    }

    isContinuous() {
        if(this.findfullL() === null || this.findF() === null) return false;
        return true;
    }
}

let ptLabel = document.getElementById('ptLabel');

ptLabel.addEventListener('click', (event)=> {
    console.log("You clicked me!");
    event.stopPropagation();
});

let lhLimit = document.getElementById('lhLimit');

ptLabel.addEventListener('click', (event) => {
    console.log("You clicked me!");
    event.stopPropagation();
});