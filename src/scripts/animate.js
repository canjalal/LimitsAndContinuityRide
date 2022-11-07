import { FINE_GRAIN } from './mathfunction';
import { drawHorizLine, drawVertLine } from './clickpoints'

export const animateAshley = animates('startR');

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
            return async function() {
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
            return async function() {
                let i = 0;
                if(isRunning) {
                    return new Promise(resolve => {
                        clearInterval(timer);
                    isRunning = false;
                    resolve(true);
                    });
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

        let backgroundModal = document.querySelector(".overlay");

        backgroundModal.style.display = "flex";
        

        this.p = document.createElement('p');
        this.p.id = 'ashley';

        // this._xpos = xAxis.getPixelForValue(xi);
        // this._ypos = yAxis.getPixelForValue(yi);

        // this.p.style.left = `${this._xpos - A_WIDTH / 2}px`;
        // this.p.style.top = `${this._ypos + A_HEIGHT }px`;

        // this.setLocation(xi, yi);
        let mainCanvas = document.querySelector(".canvas-container");
        mainCanvas.appendChild(this.p);

        this.caption = document.createElement('div');
        this.caption.className = 'mini-splash';
        this.caption.style.width = '300px';
        this.caption.style.height = '150px';

        this.placeCaption(xi, yi);

        this.caption.style.visibility = "hidden";
    }

    placeCaption(xi, yi) { // place in corner farthest away from point
        let ymin = this.chart.scales.y.min;
        let ymax = this.chart.scales.y.max;

        let xmin = this.chart.scales.x.min;
        let xmax = this.chart.scales.x.max;

        let x, y;


        let backgroundModal = document.querySelector(".overlay");

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
        backgroundModal.appendChild(this.caption);
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

            drawVertLine.call(this.chart, clickPt.x, true);

            await this.displayCaptionPromise(() => `I'm going to start my walk
             ${clickPt.leftData[clickPt.leftData.length - 1] > clickPt.leftData[clickPt.leftData.length - 2] ? 'up' : 'down'} toward
             the next dot, can you see how ${clickPt.leftData[clickPt.leftData.length - 1] > clickPt.leftData[clickPt.leftData.length - 2] ? 'high' : 'low'} it is?`, clickPt.x);
    
             drawHorizLine.call(this.chart, clickPt.findLHL());
             
            await animateAshley.call(this.p);

            let i = 1;
            while(currpos[0] < clickPt.x - FINE_GRAIN) {
    
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2 * i);
                // this.chart.update();
                i += 1;
            }

            await animateAshley.call(this.p);

            await this.displayCaptionPromise(() => `Walking from left to right towards x = ${clickPt.x}, I go ${clickPt.leftData[clickPt.leftData.length - 1] > clickPt.leftData[clickPt.leftData.length - 2] ? 'up' : 'down'}
            the hill, getting closer and closer to a height of ${clickPt.lhL}. That's the left-handed limit.`, clickPt.x);

        } else {

            this.p.style.background = 'url("./src/WalkingGirlForward.png")';
            this.p.style.backgroundSize = '72px';
            this.p.style.backgroundPosition = 'bottom 47px right -1px';
    
            let yf = this.chart.scales.y.min;
            
            let prevnode = clickPt.mathF.pNode; // find previous slope

            while(prevnode.next.x !== clickPt.x) {
                prevnode = prevnode.next;
            }
            // console.log(prevnode);

            let prevSlope = prevnode.m;
    
            let yi = clickPt.node.y - 0.5 * prevSlope;
            let xi = clickPt.x - 0.5;
            let currpos = this.setLocation(xi, yi);


            drawVertLine.call(this.chart, clickPt.x, true);

           await this.displayCaptionPromise(() => `I'm going to TRY to start my walk
             ${clickPt.leftData[clickPt.leftData.length - 1] > clickPt.leftData[clickPt.leftData.length - 2] ? 'up' : 'down'} toward
             the next dot to the right, do you see a problem with me getting there?`, clickPt.x);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 10);
                v -= 0.001;
    
                yi += v;
            }
    
            currpos = await this.movewithDelay(xi, yf, 1000);

            await this.displayCaptionPromise(() => `I tried to walk on the function towards x = ${clickPt.x} but there's a gap so I fell down.
            This means the left-handed limit is undefined.`, clickPt.x);

            this.p.style.background = 'url("./src/WalkingGirl2.png")';
            this.p.style.backgroundSize = '84px';
            this.p.style.backgroundPosition = 'bottom 54px right -2px';


        }
    }

    async animaterhL(clickPt) {

        if(clickPt.findRHL()) {

            drawVertLine.call(this.chart, clickPt.x, true);

            this.p.style.transform = 'scaleX(-1)';

            let xcoords = [];
    
            for(let i = clickPt.x + 1; i > clickPt.x; i -= FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.rightData.slice();
    
            ycoords.reverse();
    
            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            await this.displayCaptionPromise(() => `I'm going to start my walk
             ${ycoords[ycoords.length - 2] > ycoords[ycoords.length - 3] ? 'up' : 'down'} toward 
             the next dot, can you see how ${ycoords[ycoords.length - 2] > ycoords[ycoords.length - 3] ? 'high' : 'low'} it is?`, clickPt.x);

             drawHorizLine.call(this.chart, clickPt.findRHL());

            await animateAshley.call(this.p);
    
            let i = 1;
            while(currpos[0] > clickPt.x + 2 * FINE_GRAIN) {
    
                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2 * i);
                // this.chart.update();
                i += 1;
            }

            await animateAshley.call(this.p);
    
            await this.displayCaptionPromise(() => `Walking from right to left towards x = ${clickPt.x}, I go ${ycoords[ycoords.length - 2] > ycoords[ycoords.length - 3] ? 'up' : 'down'}
            the hill, getting closer and closer to a height of ${clickPt.rhL}. That's the right-handed limit.`, clickPt.x);

            this.p.style.transform = 'scaleX(1)'; // don't forget to reverse this

        } else {


            this.p.style.background = 'url("./src/WalkingGirlForward.png")';
            this.p.style.backgroundSize = '72px';
            this.p.style.backgroundPosition = 'bottom 47px right -1px';
    
            let yf = this.chart.scales.y.min;
    
            let yi = (clickPt.node.y + clickPt.node.next.y) / 2;
            let xi = clickPt.x + 0.5;
            let currpos = this.setLocation(xi, yi);

            drawVertLine.call(this.chart, clickPt.x, true);

            await this.displayCaptionPromise(() => `I'm going to TRY to start my walk
             ${yi > clickPt.node.next.y ? 'up' : 'down'} toward 
             the next dot to the left, do you see a problem with me getting there?`, clickPt.x);
    
            let v = -0.03;
    
            while(currpos[1] > yf) {
    
                currpos = await this.movewithDelay(xi, yi, 10);
                // this.chart.update();
                v -= 0.001;
    
                yi += v;
            }

    
            currpos = await this.movewithDelay(xi, yf, 1000);


            await this.displayCaptionPromise(() => `I tried to walk on the function towards x = ${clickPt.x} but there's a gap so I fell down.
            This means the right-handed limit is undefined.`, clickPt.x);

        }

    
        
    }

    async displayCaptionPromise(textcallback, xval) {

        const timeout = async (ms) => new Promise(res => setTimeout(res, ms));

        let timeToMoveOn = false; // ready for user to move on

        const newButton = document.createElement("div");
        function doneModal(e) {
            timeToMoveOn = true;
        }
        newButton.classList.toggle("continue-button")
        newButton.innerHTML = "Continue >>>";
        newButton.addEventListener("click", doneModal);
        this.caption.style.visibility = "visible";

        this.caption.innerHTML = textcallback();
        this.caption.appendChild(newButton);

        // drawVertLine.call(this.chart, xval, true);

        while(timeToMoveOn === false) await timeout(50);
        
        timeToMoveOn = false;
        newButton.removeEventListener("click", doneModal);
        this.caption.removeChild(newButton);

        this.caption.style.visibility = "hidden";
    }

    async animatefullL(clickPt) {
        let fullL = clickPt.fullL;
        let textcallback;
        if(fullL === "undefined") {
            textcallback = () => `Since I'm ending up higher on one side than the other side,
            the two-sided full limit is undefined.`;
        } else {
            textcallback = () => `Since I'm ending up just as high from the left side as I am from the right side,
            the two-sided full limit is ${fullL}`;
        }

        await this.animatelhL(clickPt);
        await this.animaterhL(clickPt);
        // console.log(this.chart.scales.y.max);
        drawVertLine.call(this.chart, clickPt.x, true);
        await this.displayCaptionPromise(textcallback, clickPt.x);
    }

    async animateFuncValue(clickPt) {
        this.p.style.background = 'url("./src/WalkingGirlForward.png")';
        this.p.style.backgroundSize = '72px';
        this.p.style.backgroundPosition = 'bottom 47px right -1px';
        this.p.style.animationName = 'glow';
        this.p.style.animationDuration = '1s';
    
        
        let fVal = clickPt.fValue;
        let yf = this.chart.scales.y.min;

        let yi = this.chart.scales.y.max;
        let xi = clickPt.x;
        let currpos = this.setLocation(xi, yi);

        drawVertLine.call(this.chart, clickPt.x, true);

        await this.displayCaptionPromise(() => `I'm going to try to jump onto the function from above. Can you guess how far I'll fall? Will I fall through any gaps or holes?`, clickPt.x);

        if(fVal !== "undefined") {
            yf = clickPt.node.yFilled;
            drawHorizLine.call(this.chart, yf);
        }

        let v = -0.03;

        while(currpos[1] > yf) {

            currpos = await this.movewithDelay(xi, yi, 10);
            v -= 0.001;

            yi += v;
        }

        currpos = await this.movewithDelay(xi, yf, 1000);

        if(fVal === "undefined") {
            await this.displayCaptionPromise(() => `When I try to land on the function at x = ${clickPt.x}, there's a gap that I fall through, so the function value f(${clickPt.x}) is undefined.`, clickPt.x);
        } else {
            yf = clickPt.node.yFilled;
            // this.caption.innerHTML = `When I try to land on the function at x = ${clickPt.x}, I land at a height of y = ${fVal}, and that's the value of f(${clickPt.x})`;
            await this.displayCaptionPromise(() => `When I try to land on the function at x = ${clickPt.x}, I land at a height of y = ${fVal}, and that's the value of f(${clickPt.x})`, clickPt.x);
            drawHorizLine.call(this.chart, yf);
        }

    }

    async animateContinuity(clickPt) {
        if(clickPt.findLHL()) {
            let xcoords = [];

            for(let i = clickPt.x - 1; i < clickPt.x; i += FINE_GRAIN) {
                xcoords.push(i);
            }
            let ycoords = clickPt.leftData;

            drawVertLine.call(this.chart, clickPt.x, true);

            let currpos = this.setLocation(xcoords[1], ycoords[1]);

            await this.displayCaptionPromise(() => `I'm about to run on the graph past the dashed line, can you see whether it'll be fine or will I fall off?`, clickPt.x);
            animateAshley.call(this.p);
            let i = 1;
            while(currpos[0] < clickPt.x) {

                currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10);
                i += 1;
            }

            let xi = clickPt.x;
            let yi = ycoords[ycoords.length - 1]

            if(!clickPt.isContinuous()) {

                let m = ycoords[ycoords.length - 1] - ycoords[ycoords.length - 2];
                m = Math.min(m * 0.8, 0);

                yi -= (this.chart.scales.y.max - this.chart.scales.y.min) / 200; // not physics-true, but make the person
                                                                                    // go down after the hole
                currpos = this.setLocation(xi, yi);

                let yf = this.chart.scales.y.min;

                while(currpos[1] > yf) {

                    currpos = await this.movewithDelay(xi, yi, 10);
                    m -= 0.001;
                    xi += FINE_GRAIN;
        
                    yi += m;
                }

                await animateAshley.call(this.p);

                await this.displayCaptionPromise(() => `When I try to run on the function over x = ${clickPt.x}, there's a jump or gap that I fall through, so the function isn't continuous there`, clickPt.x);

                
            } else {

                xcoords = [];

                for(let i = clickPt.x; i < clickPt.x + 1; i += FINE_GRAIN) {
                    xcoords.push(i);
                }
                ycoords = clickPt.rightData;
        
                currpos = this.setLocation(xcoords[1], ycoords[1]);
                
                let i = 1;
                while(currpos[0] < clickPt.x + 0.5) {
        
                    currpos = await this.movewithDelay(xcoords[i], ycoords[i], 10 + 2* i);
                    i += 1;
                }

                await animateAshley.call(this.p);

                await this.displayCaptionPromise(() => `When I try to run on the function over x = ${clickPt.x}, there's no jump or gap for me to fall through, so the function is continuous there`, clickPt.x);


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
        let backgroundModal = document.querySelector(".overlay");
        let mainCanvas = document.querySelector(".canvas-container");

        backgroundModal.style.display = "none"
        mainCanvas.removeChild(this.p);
        backgroundModal.removeChild(this.caption);
    }
}
