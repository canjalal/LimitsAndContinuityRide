// export function animateLeft() {

//     const interval = 100;

//     let i = 0;
//     var startpos = -4;

//     function spritePos(i) {
//         return startpos + (i % 4) * 20;
//     }

//     let timer = setInterval(() => {
//         this.style.backgroundPosition = `bottom 52px right ${spritePos(i)}px`;
//         i++;
//     }, interval);
// }

export const animateRight = animates('startR');

export const animateLeft = animates('startL');

export const stopAnimation = animates('stop');

function animates(action) {

    const interval = 100;
    let startpos = -4;

    let timer = null;

    let isRunning = false;

    function spritePos(i) {
        return startpos + (i % 4) * 20;
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
                        this.style.backgroundPosition = `bottom 52px right ${spritePos(i)}px`;
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
                        this.style.backgroundPosition = `bottom 52px right ${spritePos(i)}px`;
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