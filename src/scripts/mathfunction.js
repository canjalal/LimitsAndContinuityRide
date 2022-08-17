import {
  BlankNode,
  jumpDisNode,
  POINT_TYPES,
  regNode,
  removDisNode,
  vertAsympNode,
} from "./pointnode";

export class MathFunction {
  constructor() {
    this.yvalues = []; // y-values
    this.mvalues = []; // derivative values
    this.yvalues[0] = ((Math.random() - 0.5) * (MAX_X - MIN_X)) / 2; // random y value
    this.mvalues[0] = (Math.random() - 0.5) * 5 * VOLATILITY; // random slope
    for (let i = 0; i < coarseLabels.length - 1; i++) { // populate default y and slope values at nodes
      this.yvalues[i + 1] = this.mvalues[i] * 1 + this.yvalues[i];
      this.mvalues[i + 1] =
        this.mvalues[i] + (Math.random() - 0.5) * VOLATILITY;
    }

    this.generateRandomFunction();
  }

  generatefineData() {
    // let currnode = this.pNode.next;
    let outputarray = [];
    outputarray.push(...this.pNode.yValues);
    // while (currnode) {
    //   outputarray.push(...currnode.yValues);
    //   currnode = currnode.next;
    // }
    this.forEachNode((prevnode, currnode) => {
        outputarray.push(...currnode.yValues);
    });

    return outputarray;
  }

  forEachNode(callback) {
      let prevnode = this.pNode;
      let currnode = prevnode.next;
      while(currnode) {
        callback(prevnode, currnode);

        prevnode = currnode;
        currnode = prevnode.next;
      }
  }

  generateRandomFunction() {
    this.pNode = new regNode(coarseLabels[0], this.yvalues[0], this.mvalues[0]);
    let prevnode = this.pNode;
    let currnode;

    for (let i = 1; i < coarseLabels.length; i++) {
      if (i % 2 === 0) {
        currnode = new regNode(
          coarseLabels[i],
          this.yvalues[i],
          this.mvalues[i]
        );
        // currnode.generatefineY();
      } else {
        let currtype = POINT_TYPES[Math.floor(Math.random() * 5)];
        switch (currtype) {
          case "regular":
            currnode = new regNode(
              coarseLabels[i],
              this.yvalues[i],
              this.mvalues[i]
            );
            break;
          case "vertAsymp":
            currnode = new vertAsympNode(
              coarseLabels[i],
              this.yvalues[i],
              this.mvalues[i]
            );
            // render vertical lines
            break;
          case "removeable":
            currnode = new removDisNode(
              coarseLabels[i],
              this.yvalues[i],
              this.mvalues[i]
            );

            break;
          case "jumpDisc":
            currnode = new jumpDisNode(
              coarseLabels[i],
              this.yvalues[i],
              this.mvalues[i]
            );
            break;
          case "blankGap":
            currnode = new BlankNode(
              coarseLabels[i],
              this.yvalues[i],
              this.mvalues[i]
            );
        }

      }
      prevnode.next = currnode;
      prevnode = currnode;

    }

    this.forEachNode((prevnode, currnode) => {
        prevnode.generatefineY();
    });

    
  }

  generateDiscretePts() {
    let dataSet = [];

    if (this.pNode) {
      let currnode = this.pNode;

      // prevnode = currnode;

      for (let i = 0; i < coarseLabels.length; i++) {
        // let currnode = new regNode(coarseLabels[i], this.yvalues[i], this.mvalues[i]);
        if (currnode.yFilled)
          dataSet.push({
            x: coarseLabels[i],
            y: currnode.yFilled,
            type: currnode.type,
          });
        currnode = currnode.next;
      }
    }

    dataSet.shift();
    dataSet.pop(); // take off endpoints
    return dataSet;
  }

  generateHoles() {
    let dataSet = [];

    if (this.pNode) {
      let currnode = this.pNode;

      // prevnode = currnode;

      for (let i = 0; i < coarseLabels.length; i++) {
        if (currnode.yunFilled)
          dataSet.push({
            x: coarseLabels[i],
            y: currnode.yunFilled,
            type: currnode.type,
          });
        currnode = currnode.next;
      }
    }

    return dataSet;
  }
}

export const MIN_X = -8;
export const MAX_X = 8;
export const VOLATILITY = 0.5;
export const FINE_GRAIN = 0.02;

export const coarseLabels = [];

for (let x = MIN_X; x <= MAX_X; x++) {
  coarseLabels.push(x);
}

export const fineLabels = [];

for (let x = MIN_X; x <= MAX_X; x += FINE_GRAIN) {
  fineLabels.push(x);

}
