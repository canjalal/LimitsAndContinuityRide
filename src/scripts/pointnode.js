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
        for(let i = 0; i < 1; i += 0.02) {
            this.fineX.push(i);
        }
    }
}

const POINT_TYPES = ['regular', 'vertAsymp', 'removeable', 'jumpDisc'];

class regNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, 'regular');
        this.yFilled = y;
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

    }
}

class vertAsympNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, 'vertAsymp'); // neither y-filled nor y-unfilled is defined
    } // don't have vertical asymptotes next to each other

    generatefineY() {
        // console.log(this.next);
        this.yValues = new Array();
        let mNext = this.next.m;
        let yNext = this.next.y;
        for(let x of this.fineX) {
            this.yValues.push(Math.log(x) + (mNext - 1) * (x - 1) + yNext) // vertical asymptote at 0 and matching slope at 1
        }
        this.yValues[0] = NaN;
        // this.yValues[1] = NaN;

    }
}

class removDisNode extends PointNode {
    constructor(x, y, m) {
        super(x, y, m, "removeable");
        this.yFilled = y + Math.sign(Math.random() - 0.5) * 2; // y-value is defined but not at y-unfilled, otherwise same as regNode
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
        this.yunFilled = y + Math.sign(Math.random() - 0.5) * 4 * Math.random(); // function continues forth from y-unfilled
        // left-handed limit is yunffilled

    }

    generatefineY() {
        this.yValues = new Array();
        let yNext = this.next.y;
        let fake_m = yNext - this.yunFilled;  // redefine the slope
        if(this.next instanceof vertAsympNode) {
            for(let x of this.fineX) {
                this.yValues.push(2*fake_m  / (2*Math.PI) * Math.tan(Math.PI*x / 2) + this.y); // generate linear values (for now)
            }
        } else {
            for(let x of this.fineX) {
                this.yValues.push(fake_m * x + this.yunFilled); // generate linear values (for now)
            }
        }
        this.yValues[0] = NaN;
        console.log(this.yValues);
        // this.yValues[1] = NaN;
    }

}

export { regNode, vertAsympNode, removDisNode, jumpDisNode, POINT_TYPES };