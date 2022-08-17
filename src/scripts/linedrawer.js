const { drawHorizLine, drawVertLine } = require("./clickpoints");

export class LineDrawer {
    constructor(chart) {
        this.chart = chart;
        this.activeVertLines = {};
        this.activeHorizLines = {};
    }

    addVertLine(x, dashed = true) {
        if(x !== null) this.activeVertLines[x] = dashed;
        // console.log(this.activeVertLines);
    }

    addHorizLine(y, dashed = true) {
        if(y !== null) this.activeHorizLines[y] = dashed;
        // console.log(this.activeHorizLines);
    }

    removeVertLine(x) {
        delete this.activeVertLines[x];
        // console.log(this.activeVertLines);
    }

    removeHorizLine(y) {
        delete this.activeHorizLines[y];
        // console.log(this.activeHorizLines);
    }

    drawLines() {
        for(let x in this.activeVertLines) {
            drawVertLine.bind(this.chart)(parseFloat(x));
        }
        for(let y in this.activeHorizLines) {
            drawHorizLine.bind(this.chart)(parseFloat(y));
        }
    }
}