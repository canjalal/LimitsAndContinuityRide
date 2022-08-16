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

    }

    generaterightBar() {
    //     <ul class="right-bar">
    //     <li id="ptLabel"></li>
    //     <li id="lhLimit">Left-hand Limit</li>
    //     <li id="rhLimit">Right-hand Limit</li>
    //     <li id="fullLimit">Full Limit</li>
    //     <li id="funcValue">Function Value</li>
    //     <li id="continuity">Continuity</li>
    //   </ul>
        const newRightBar = document.createElement('ul');
        newRightBar.className = 'right-bar';

        // can create a createLI helper function to DRY up this code, that takes an id, innerText, and callback for click event:

        const ptLabel = document.createElement('li');
        ptLabel.id = 'ptLabel';
        ptLabel.innerText = `x = ${this.x}`;
        ptLabel.addEventListener('click', (event)=> {
            console.log("You clicked me!");
        });

        const lhLimit = document.createElement('li');
        lhLimit.id = 'lhLimit';
        lhLimit.innerText = 'Left-hand Limit';
        lhLimit.addEventListener('click', (event)=> {
            console.log(this.findLHL());
        });

        const rhLimit = document.createElement('li');
        rhLimit.id = 'rhLimit';
        rhLimit.innerText = 'Right-hand Limit';
        rhLimit.addEventListener('click', (event)=> {
            console.log(this.findRHL());
        });

        const fullLimit = document.createElement('li');
        fullLimit.id = 'rhLimit';
        fullLimit.innerText = 'Full Limit';
        fullLimit.addEventListener('click', (event)=> {
            console.log(this.findfullL());
        });

        const funcValue = document.createElement('li');
        funcValue.id = 'funcValue';
        funcValue.innerText = 'Function Value';
        funcValue.addEventListener('click', (event)=> {
            console.log(this.findF());
        });

        const continuity = document.createElement('li');
        continuity.id = 'continuity';
        continuity.innerText = 'Continuity';
        continuity.addEventListener('click', (event)=> {
            console.log(this.isContinuous());
        });

        newRightBar.appendChild(ptLabel);
        newRightBar.appendChild(lhLimit);
        newRightBar.appendChild(rhLimit);
        newRightBar.appendChild(fullLimit);
        newRightBar.appendChild(funcValue);
        newRightBar.appendChild(continuity);

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