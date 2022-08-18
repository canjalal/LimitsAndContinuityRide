import { FINE_GRAIN } from './mathfunction';
import { drawHorizLine, drawVertLine } from './clickpoints'

export const animateRight = animates('startR');

export const animateLeft = animates('startL');

export const stopAnimation = animates('stop');

function animates(action) {

    const interval = 100;
    let startpos = -2;

    let timer = null;

    let isRunning = false;

    function spritePos(i) {
        return startpos + (i % 4) * 21;
    }

    switch (action) {
        case 'startL':
            return function() {
                console.log("Again");
                // isRunning = true;
                this.style.transform = 'scaleX(1)';
                let i = 0;
                if(isRunning) {
                    clearInterval(timer);
                    isRunning = false;
                } else {
                    timer = setInterval(() => {
                        this.style.backgroundPosition = `bottom 54px right ${spritePos(i)}px`;
                        i++;
                    }, interval);
                    isRunning = true;
                }
            }
            break;
        case 'startR':
            return function() {
                this.style.transform = 'scaleX(-1)';
                let i = 0;
                if(isRunning) {
                    clearInterval(timer);
                    isRunning = false;
                } else {
                    timer = setInterval(() => {
                        this.style.backgroundPosition = `bottom 54px right ${spritePos(i)}px`;
                        i++;
                    }, interval);
                    isRunning = true;
                }
            }
            break;
        case 'stop':
            return function() {
                clearInterval(timer);
                this.style.backgroundPosition = `bottom 52px right ${startpos}px`;
            }
            break;
    }



}

        // size of image is currently hard-coded to be 15px by 22px, this needs to be changed in index.scss as well

const A_WIDTH = 15;
const A_HEIGHT = 22;

export class Ashley {
    constructor(xi, yi, chart) { // refactor to remove xi and yi bc they aren't needed

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

        // this.setLocation(xi, yi);
        document.body.appendChild(this.p);

        this.caption = document.createElement('div');
        this.caption.className = 'mini-splash';
        this.caption.style.width = '300px';
        this.caption.style.height = '150px';

        this.placeCaption(xi, yi);
    }

    placeCaption(xi, yi) { // place in corner farthest away from point
        let ymin = this.chart.scales.y.min;
        let ymax = this.chart.scales.y.max;

        let xmin = this.chart.scales.x.min;
        let xmax = this.chart.scales.x.max;

        let x, y;

        if (xmax - xi > xi - xmin) { // if it's farther from right side than left side, put caption on right side
            x = `${this.xAxis.getPixelForValue(xmax) - parseFloat(this.caption.style.width)}px`;
        } else {
            x = `${this.xAxis.getPixelForValue(xmin)}px`;
        }

        if (ymax - yi > yi - ymin) { // if it's farther from the top than the bottom, put caption on top
            y = `${this.yAxis.getPixelForValue(ymax) + parseFloat(this.caption.style.height)}px`;
        } else {
            y = `${this.yAxis.getPixelForValue(ymin) - parseFloat(this.caption.style.height)}px`;
        }
        this.caption.style.left = x;
        this.caption.style.top = y;
        document.body.appendChild(this.caption);
    }

    setLocation(x, y) {

        this._xpos = this.xAxis.getPixelForValue(x);
        this._ypos = this.yAxis.getPixelForValue(y);

        this.p.style.left = `${this._xpos - A_WIDTH / 2}px`;
        this.p.style.top = `${this._ypos + 2 * A_HEIGHT }px`;

        return [x, y];
    }

    async animatelhL(clickPt) {

        // console.log([clickPt.x, clickPt.y]);
        if(clickPt.findLHL()) {

            let xcoords = [];

            for(let i = clickPt.x - 1; i < clickPt.x; i += FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.leftData;
    

    
            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            drawHorizLine.call(this.chart, clickPt.findLHL());
            drawVertLine.call(this.chart, clickPt.x);

            await this.displayCaptionPromise(() => `Walking from left to right towards x = ${clickPt.x}, I go ${clickPt.leftData[clickPt.leftData.length - 1] > clickPt.leftData[clickPt.leftData.length - 2] ? 'up' : 'down'}
            the hill, getting closer and closer to a height of ${clickPt.lhL}. That's the left-handed limit.`, 4000);
    
            // console.log(currx);
    
            let i = 1;
            while(currpos[0] < clickPt.x) {
    
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2 * i);
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

            await this.displayCaptionPromise(() => `I'm trying to walk on the function towards x = ${clickPt.x} but there's a gap so I fall down.
            Hence the left-handed limit is undefined.`, 4000);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 10);
                this.chart.update();
                v -= 0.001;
    
                yi += v;
            }
    
            currpos = await this.movewithDelay(xi, yf, 1000);

            this.p.style.background = 'url("./src/WalkingGirl2.png")';
            this.p.style.backgroundSize = '84px';
            this.p.style.backgroundPosition = 'bottom 54px right -2px';


        }

        // console.log(this.chart);

        // drawVertLine.call(this.chart, currx);
        // drawHorizLine.call(this.chart, currx[1]);
        // return [ycoords[ycoords.length - 2], ycoords[ycoords.length - 1]]; // last two points to get slope
    }

    async animaterhL(clickPt) {

        if(clickPt.findRHL()) {

            drawHorizLine.call(this.chart, clickPt.findRHL());
            drawVertLine.call(this.chart, clickPt.x);

            this.p.style.transform = 'scaleX(-1)';

            let xcoords = [];
    
            for(let i = clickPt.x + 1; i > clickPt.x; i -= FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.rightData.slice();
    
            ycoords.reverse();
    
            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            await this.displayCaptionPromise(() => `Walking from right to left towards x = ${clickPt.x}, I go ${ycoords[ycoords.length - 2] > ycoords[ycoords.length - 3] ? 'up' : 'down'}
            the hill, getting closer and closer to a height of ${clickPt.rhL}. That's the right-handed limit.`, 4000);

    
            // console.log(currx);
    
            let i = 1;
            while(currpos[0] > clickPt.x + FINE_GRAIN) {
    
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2 * i);
                // this.chart.update();
                i += 1;
            }
            // console.log(this.chart);
    
            // drawVertLine.call(this.chart, currx);
    
    
            this.p.style.transform = 'scaleX(1)'; // don't forget to reverse this
    
            return true;

        } else {


            this.p.style.background = 'url("./src/WalkingGirlForward.png")';
            this.p.style.backgroundSize = '72px';
            this.p.style.backgroundPosition = 'bottom 47px right -1px';
    
            let yf = this.chart.scales.y.min;
    
            let yi = clickPt.node.y;
            let xi = clickPt.x + 0.5;
            let currpos = this.setLocation(xi, yi);

            await this.displayCaptionPromise(() => `I'm trying to walk on the function towards x = ${clickPt.x} but there's a gap so I fall down.
            Hence the right-handed limit is undefined.`, 4000);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 10);
                // this.chart.update();
                v -= 0.001;
    
                yi += v;
            }
    
            currpos = await this.movewithDelay(xi, yf, 1000);

        }

    
        
    }

    async displayCaptionPromise(textcallback, delay = 3000) {
        return new Promise(resolve => {
            this.caption.innerHTML = textcallback();
            setTimeout(() => {
                resolve(true);
            }, delay);
        });
    }

    async animatefullL(clickPt) {
        let fullL = clickPt.fullL;
        let textcallback;
        if(fullL === "undefined") {
            textcallback = () => `Since the height I think I'm going to from the left is different from the one I'm going
            from the right, the two-sided full limit is undefined.`;
        } else {
            textcallback = () => `Since the height I think I'm going to from the left is the same as the one I'm approaching
            from the right, the two-sided full limit is ${fullL}`;
        }

        await this.animatelhL(clickPt);
        await this.animaterhL(clickPt);
        // console.log(this.chart.scales.y.max);
        drawVertLine.call(this.chart, clickPt.x);
        await this.displayCaptionPromise(textcallback, 3000);
    }

    async animateFuncValue(clickPt) {
        this.p.style.background = 'url("./src/WalkingGirlForward.png")';
        this.p.style.backgroundSize = '72px';
        this.p.style.backgroundPosition = 'bottom 47px right -1px';
        let fVal = clickPt.fValue;
        let yf = this.chart.scales.y.min;

        let yi = this.chart.scales.y.max;
        let xi = clickPt.x;
        let currpos = this.setLocation(xi, yi);

        drawVertLine.call(this.chart, clickPt.x);
        if(fVal === "undefined") {
            await this.displayCaptionPromise(() => `When I try to land on the function at x = ${clickPt.x}, there's some sort of gap that I fall through, so the function value f(${clickPt.x}) is undefined.`, 3000);
        } else {
            yf = clickPt.node.yFilled;
            // this.caption.innerHTML = `When I try to land on the function at x = ${clickPt.x}, I land at a height of y = ${fVal}, and that's the value of f(${clickPt.x})`;
            await this.displayCaptionPromise(() => `When I try to land on the function at x = ${clickPt.x}, I land at a height of y = ${fVal}, and that's the value of f(${clickPt.x})`, 3000);
            drawHorizLine.call(this.chart, yf);
        }

        let v = -0.03;

        while(currpos[1] > yf) {

            currpos = await this.movewithDelay(xi, yi, 10);
            v -= 0.001;

            yi += v;
        }

        currpos = await this.movewithDelay(xi, yf, 1000);

    }

    async animateContinuity(clickPt) {
        if(clickPt.findLHL()) {
            let xcoords = [];

            for(let i = clickPt.x - 1; i < clickPt.x; i += FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.leftData;

            drawVertLine.call(this.chart, clickPt.x);

            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            if (clickPt.isContinuous()) {
                await this.displayCaptionPromise(() => `When I try to run on the function over x = ${clickPt.x}, there's no jump or gap for me to fall through, so the function is continuous there`, 3000);
            } else {
                await this.displayCaptionPromise(() => `When I try to run on the function over x = ${clickPt.x}, there's a jump or gap that I fall through, so the function isn't continuous there`, 3000);
            }

            // console.log(currx);

            let i = 1;
            while(currpos[0] < clickPt.x) {

                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10);
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

                    currpos = await this.movewithDelay(xi, yi, 10);
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
        
                    currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2* i);
                    this.chart.update();
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
        this.caption.parentNode.removeChild(this.caption);
    }
}
