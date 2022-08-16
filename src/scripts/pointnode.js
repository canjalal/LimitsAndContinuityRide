import { FINE_GRAIN, VOLATILITY } from "./mathfunction";

class PointNode {
    constructor(x, y, m, type) {
        this.next = null;
         // this.prev = null;
        this.yValues = [];
        this.x = x;
        this.y = y;
        this.m = m;
        this.type = type;
        this.yFilled = null;
        this.yunFilled = null;
        this.fineX = [];
        for(let i = 0; i < 1; i += FINE_GRAIN) {
            this.fineX.push(i);
        }
    }
}

PointNode.randomJump = function(size, fluct) {

    // generate jump of random sign, of average size SIZE and amplitude of FLUCT / 2.

    let randomSign = Math.sign(Math.random() - 0.5); // random sign
    
    return randomSign * (size + fluct * Math.random() / 2);
}

const POINT_TYPES = ['regular', 'vertAsymp', 'removeable', 'jumpDisc'];

class regNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, 'regular');
        this.yFilled = y;
    }

    generatefineY() {
        this.yValues = new Array();
        let mNext = this.next.m;
        if(this.next instanceof vertAsympNode && Math.random() > 0.33) { // some vertical asymptotes are only one-way
            for(let x of this.fineX) {
                // this.yValues.push(2*this.m  / (2*Math.PI) * Math.tan(Math.PI*x / 2) + this.y); // generate linear values (for now)
                this.yValues.push(Math.sign(mNext) * Math.log(1 - x) + (this.m + 1 * Math.sign(mNext)) * x + this.y)
            }
            this.yValues[this.yValues.length - 1] += (this.yValues[this.yValues.length - 1] - this.yValues[this.yValues.length - 2]) * 3;
            // this.yValues.at(-1) = Math.sign(this.m) * this.yValues.at(-1);
        } else {
            for(let x of this.fineX) {
                this.yValues.push(this.m * x + this.y); // generate linear values (for now)
            }
        }

    }
}

class vertAsympNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, 'vertAsymp');
        this.yunFilled = y; // neither y-filled nor y-unfilled is defined
    } // don't have vertical asymptotes next to each other

    generatefineY() {
        // console.log(this.next);
        this.yValues = new Array();
        let mNext = this.next.m;
        let yNext = this.next.y;
        for(let x of this.fineX) {
            this.yValues.push(-Math.sign(this.m) * Math.log(x) + (mNext + 1 * Math.sign(this.m)) * (x - 1) + yNext) // vertical asymptote at 0 and matching slope at 1
        }
        this.yValues[0] = NaN;
        this.yValues[1] += (this.yValues[1] - this.yValues[2]) * 3;

    }
}

class removDisNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, "removeable");
                // generate a jump of random sign that is between one and two
        if(Math.random() > 0.33 ) this.yFilled = y + PointNode.randomJump(VOLATILITY, 1); // y-value is defined but not at y-unfilled, otherwise same as regNode
        // <-- some removeable discontinuities dont have a value
        this.yunFilled = y;
    }
    generatefineY() {
        this.yValues = new Array();
        if(this.next instanceof vertAsympNode) {
            for(let x of this.fineX) {
                this.yValues.push(2*this.m  / (2*Math.PI) * Math.tan(Math.PI*x / 2) + this.y); // generate linear values (for now)
            }
        } else {
            for(let x of this.fineX) {
                this.yValues.push(this.m * x + this.y); // generate linear values (for now)
            }
        }

        this.yValues[0] = NaN;

    }
}

class jumpDisNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, "jumpDisc");
        this.yFilled = y;
        // generate a jump of random sign that is at between 1 and 2
        this.yunFilled = y + PointNode.randomJump(VOLATILITY, 1); // function continues forth from y-unfilled
        // left-handed limit is yunffilled

    }

    generatefineY() {
        this.yValues = new Array();
        let yNext = this.next.y;
        let mNext = this.next.m;
        let fake_m = yNext - this.yunFilled;  // redefine the slope
        if(this.next instanceof vertAsympNode) {
            for(let x of this.fineX) {
                this.yValues.push(2*fake_m  / (2*Math.PI) * Math.tan(Math.PI*x / 2) + this.y); // generate linear values (for now)
            }
        } else {
            for(let x of this.fineX) {
                this.yValues.push(fake_m * x + this.yunFilled); // generate linear values (for now)
                // this.yValues.push(-2 * fake_m / Math.PI * Math.atan((x - 1) * Math.PI * mNext / ( -2 * fake_m)) + yNext);
            }
        }
        this.yValues[0] = NaN;
        // console.log(this.yValues);
        // this.yValues[1] = NaN;
    }

}

export { regNode, vertAsympNode, removDisNode, jumpDisNode, POINT_TYPES };