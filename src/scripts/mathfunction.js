import { jumpDisNode, POINT_TYPES, regNode, removDisNode, vertAsympNode } from "./pointnode";

export class MathFunction {
    constructor() {
        this.yvalues = []; // y-values
        this.mvalues = []; // derivative values
        this.yvalues[0] = (Math.random() - 0.5)*(MAX_X - MIN_X)/4; // random y value
        this.mvalues[0] = (Math.random() - 0.5) * 0.5; // random slope
        for(let i = 0; i < coarseLabels.length - 1; i++) {
            this.yvalues[i + 1] = this.mvalues[i] * (1) + this.yvalues[i];
            this.mvalues[i + 1] = this.mvalues[i] + (Math.random() - 0.5) * 0.5;
        }

        this.generateRandomFunction();
    }
    generatePlainFunction() {
        this.pNode = new regNode(coarseLabels[0], this.yvalues[0], this.mvalues[0]);
        let prevnode = this.pNode;
        for(let i = 1; i < coarseLabels.length; i++) {
            let currnode = new regNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
            currnode.generatefineY();
            prevnode.next = currnode;
            prevnode = currnode;
        }
    }

    generatefineData() {
        let currnode = this.pNode.next;
        let outputarray = [];
        outputarray.push(...this.pNode.yValues);
        while(currnode) {
            outputarray.push(...currnode.yValues);
            currnode = currnode.next;
        }
        console.log(outputarray.length);
        return outputarray;

    }

    generateRandomFunction() {
        this.pNode = new regNode(coarseLabels[0], this.yvalues[0], this.mvalues[0]);
        let prevnode = this.pNode;
        let currnode;
        
        for(let i = 1; i < coarseLabels.length; i++) {
            if(i % 2 === 0) {
                currnode = new regNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
                // currnode.generatefineY();
                prevnode.next = currnode;
                prevnode = currnode;
            } else {

                let currtype = POINT_TYPES[Math.floor(Math.random() * 4)];
                switch(currtype) {
                    case 'regular':
                        currnode = new regNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
                        break;
                    case 'vertAsymp':
                        currnode = new vertAsympNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
                        break;
                    case 'removeable':
                        currnode = new removDisNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);

                        break;
                    case 'jumpDisc':
                        currnode = new jumpDisNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
                }

                // currnode.generatefineY();
                prevnode.next = currnode;
                prevnode = currnode;


            }

        }

        // spin this off into a helper function

        currnode = this.pNode;

        // prevnode = currnode;

        for(let i = 1; i < coarseLabels.length; i++) {
            // let currnode = new regNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
            currnode.generatefineY();
            currnode = currnode.next;
        }
    }

}

const MIN_X = -10;
const MAX_X = 10;

export const coarseLabels = [];
    
for(let x = MIN_X; x <= MAX_X; x++) {
    coarseLabels.push(x);
}

export const fineLabels = [];
    
for(let x = MIN_X; x <= MAX_X; x += 0.05) {
    fineLabels.push(x.toFixed(1));
    // console.log(x.toFixed(1));
}

// Generate features:

// Default feature: clickable filled y value
// Also, dashed vertical line with x-value highlighted
// Optional ones, unclickable unfilled y value
// asymptote