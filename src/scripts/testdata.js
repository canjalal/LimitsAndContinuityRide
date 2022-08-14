const MIN_X = -8;
const MAX_X = 8;

export const coarseLabels = [];
    
for(let x = MIN_X; x <= MAX_X; x++) {
    coarseLabels.push(x);

}

export const fineLabels = [];
    
for(let x = MIN_X; x <= MAX_X; x += 0.05) {
    fineLabels.push(x);

}



// export class MathFunction {
//     constructor(optionsHash) {
//         this.num
//     }    
// }

export function generateData(f, dataLabels) {
    let outputData = [];

    for(let x of dataLabels) {
        outputData.push(f(x));
    }

    return outputData;
}

// class MathFunction {
//     constructor() {
//         this.coarseLabels = coarseLabels;
//         this.fineLabels = fineLabels;
//     }

//     generateyValues() {
//         this.y
//     }
// }

export function generatedataHashArray(xarray, yarray) {
    let outputData = [];

    for(let i = 0; i < xarray.length; i++) {
        outputData[i] = {x: xarray[i], y: yarray[i]};
    }

    return outputData;

}