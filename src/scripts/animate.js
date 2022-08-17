import { FINE_GRAIN } from './mathfunction';
import { drawHorizLine, drawVertLine } from './clickpoints'
import { drawTempLines } from './clickpoints';

// size of image is currently hard-coded to be 15px by 22px, this needs to be changed in index.scss as well

const A_WIDTH = 15;
const A_HEIGHT = 22;

export class Ashley {
    constructor(xi, yi, chart, ld) { // refactor to remove xi and yi bc they aren't needed
        this.ld = ld;
        this.chart = chart;
        this.x = xi;
        this.y = yi;
        let ctx = chart.ctx;
        this.xAxis = chart.scales.x
        this.yAxis = chart.scales.y;

        this.p = document.createElement('p');
        this.p.id = 'ashley';

        // this._xpos = xAxis.getPixelForValue(xi);
        // this._ypos = yAxis.getPixelForValue(yi);

        // this.p.style.left = `${this._xpos - A_WIDTH / 2}px`;
        // this.p.style.top = `${this._ypos + A_HEIGHT }px`;

        this.setLocation(xi, yi);
        document.body.appendChild(this.p);

    }

    setLocation(x, y) {

        this._xpos = this.xAxis.getPixelForValue(x);
        this._ypos = this.yAxis.getPixelForValue(y);

        this.p.style.left = `${this._xpos - A_WIDTH / 2}px`;
        this.p.style.top = `${this._ypos + A_HEIGHT }px`;

        return [x, y];
    }

    async animatelhL(clickPt) {

        let lhL = clickPt.findLHL();
        this.ld.addHorizLine(lhL);
        this.ld.addVertLine(clickPt.x);
        // console.log([clickPt.x, clickPt.y]);
        if(lhL !== null) {
            let xcoords = [];
            for(let i = clickPt.x - 1; i < clickPt.x; i += FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.leftData;
            // console.log(clickPt.findLHL())

            // drawHorizLine.call(this.chart, clickPt.findLHL());

    
            let currpos = this.setLocation(xcoords[1], ycoords[1]);
    
            // console.log(currx);
    
            let i = 1;
            while(currpos[0] < clickPt.x) {
                await drawTempLines.call(this.chart, ...currpos);
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 5 + i);

                // this.chart.update();
                i += 1;
            }
        } else {

            this.p.style.background = 'url("./src/WalkingGirlForward.png")';
            this.p.style.backgroundSize = '72px';
            this.p.style.backgroundPosition = 'bottom 47px right -1px';
    
            let yf = this.chart.scales.y.min;
    
            let yi = clickPt.node.y;
            let xi = clickPt.x - 0.5;
            let currpos = this.setLocation(xi, yi);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 5);
                v -= 0.001;
    
                yi += v;
            }
    
            currpos = await this.movewithDelay(xi, yi - v, 1000);

            this.p.style.background = 'url("./src/WalkingGirl2.png")';
            this.p.style.backgroundSize = '84px';
            this.p.style.backgroundPosition = 'bottom 54px right -2px';


        }

        this.ld.removeHorizLine(lhL);
        this.ld.removeVertLine(clickPt.x);

        // console.log(this.chart);

        // drawVertLine.call(this.chart, currx);
        // drawHorizLine.call(this.chart, currx[1]);
        // return [ycoords[ycoords.length - 2], ycoords[ycoords.length - 1]]; // last two points to get slope
    }

    async animaterhL(clickPt) {

        let rhL = clickPt.findRHL()
        this.ld.addHorizLine(rhL);
        this.ld.addVertLine(clickPt.x);


        if(clickPt.findRHL()) {
            this.p.style.transform = 'scaleX(-1)';

            let xcoords = [];
    
            for(let i = clickPt.x + 1; i > clickPt.x; i -= FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.rightData.slice();
    
            ycoords.reverse();
    
            // drawHorizLine.call(this.chart, clickPt.findRHL());
    
    
            let currpos = this.setLocation(xcoords[1], ycoords[1]);
    
            // console.log(currx);
    
            let i = 1;
            while(currpos[0] > clickPt.x + FINE_GRAIN) {
                await drawTempLines.call(this.chart, ...currpos);
    
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 5 + i);
                // this.chart.update();
                i += 1;
            }
            // console.log(this.chart);
    
            // drawVertLine.call(this.chart, currx);
    
    
            this.p.style.transform = 'scaleX(1)'; // don't forget to reverse this

        } else {

            this.p.style.background = 'url("./src/WalkingGirlForward.png")';
            this.p.style.backgroundSize = '72px';
            this.p.style.backgroundPosition = 'bottom 47px right -1px';
    
            let yf = this.chart.scales.y.min;
    
            let yi = clickPt.node.y;
            let xi = clickPt.x + 0.5;
            let currpos = this.setLocation(xi, yi);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 5);
                // this.chart.update();
                v -= 0.001;
    
                yi += v;
            }
    
            currpos = await this.movewithDelay(xi, yi - v, 1000);

        }

        this.ld.removeHorizLine(rhL);
        this.ld.removeVertLine(clickPt.x);

        
    }

    async animatefullL(clickPt) {
        this.ld.addHorizLine(clickPt.findRHL());
        await this.animatelhL(clickPt);
        this.ld.addHorizLine(clickPt.findLHL());
        this.ld.removeHorizLine(clickPt.findRHL());
        await this.animaterhL(clickPt);
        this.ld.removeHorizLine(clickPt.findLHL());
        // console.log(this.chart.scales.y.max);

    }

    async animateFuncValue(clickPt) {
        this.p.style.background = 'url("./src/WalkingGirlForward.png")';
        this.p.style.backgroundSize = '72px';
        this.p.style.backgroundPosition = 'bottom 47px right -1px';


        let yf = this.chart.scales.y.min;

        if(clickPt.node.yFilled === 0) {
            yf = 0;
        } else if(clickPt.node.yFilled) {
            yf = clickPt.node.yFilled;
            this.ld.addHorizLine(yf);
        }

        let yi = this.chart.scales.y.max;
        let xi = clickPt.x;
        let currpos = this.setLocation(xi, yi);

        let v = -0.03;

        while(currpos[1] > yf) {
            await drawTempLines.call(this.chart, ...currpos);
            currpos = await this.movewithDelay(xi, yi, 5);
            v -= 0.001;

            yi += v;
        }

        currpos = await this.movewithDelay(xi, yi - v, 1000);
        this.ld.removeHorizLine(yf); // shouldn't do anything if such line doesn't exist

    }

    async animateContinuity(clickPt) {
        if(clickPt.findLHL()) {
            let xcoords = [];

            for(let i = clickPt.x - 1; i < clickPt.x; i += FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.leftData;

            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            // console.log(currx);

            let i = 1;
            while(currpos[0] < clickPt.x) {

                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 5);
                // this.chart.update();
                i += 1;
            }
            // console.log(this.chart);

            // drawVertLine.call(this.chart, currx);
            // drawHorizLine.call(this.chart, currx[1]);
            // return [ycoords[ycoords.length - 2], ycoords[ycoords.length - 1]]; // last two points to get slope

            let xi = clickPt.x;
            let yi = ycoords[ycoords.length - 1]

            if(!clickPt.isContinuous()) {

                let m = ycoords[ycoords.length - 1] - ycoords[ycoords.length - 2];
                m = Math.min(m * 0.8, 0);

                yi -= (this.chart.scales.y.max - this.chart.scales.y.min) / 200; // not physics-true, but make the person
                                                                                    // go down after the hole
                currpos = this.setLocation(xi, yi);
                // console.log(m);

                let yf = this.chart.scales.y.min;

                while(currpos[1] > yf) {

                    currpos = await this.movewithDelay(xi, yi, 5);
                    // this.chart.update();
                    m -= 0.001;
                    xi += FINE_GRAIN;
        
                    yi += m;
                }
                
            } else {

                xcoords = [];

                for(let i = clickPt.x; i < clickPt.x + 1; i += FINE_GRAIN) {
                    xcoords.push(i);
                }
                ycoords = clickPt.rightData;
        
                currpos = this.setLocation(xcoords[1], ycoords[1]);
        
                // console.log(currx);
        
                let i = 1;
                while(currpos[0] < clickPt.x + 0.5) {
        
                    currpos = await this.movewithDelay(xcoords[i], ycoords[i], 5 + i);
                    // this.chart.update();
                    i += 1;
                }

            }

            currpos = await this.movewithDelay(xi, yi, 1000);


        } else {
            await this.animatelhL(clickPt);
        }  


    }

    movewithDelay(x, y, delay) {
        return new Promise(resolve => {
            // this.chart.update();
            setTimeout(() => {
                this.setLocation(x, y);
                resolve([x, y]);
            }, delay);
        });
    }

    destroy() {
        this.p.parentNode.removeChild(this.p);
    }
}
