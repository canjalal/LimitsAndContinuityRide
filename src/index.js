// import "./scripts/styles/reset.css"
const TestData = require("./scripts/testdata.js");
const { MathFunction, coarseLabels, fineLabels, MIN_X } = require("./scripts/mathfunction");
const { regNode, vertAsympNode, removDisNode, justDisNode } = require("./scripts/pointnode");
const { ClickPoint, drawVertLine } = require("./scripts/clickpoints");
const { animateLeft, animateRight, stopAnimation, Ashley } = require("./scripts/animate.js");

window.MathFunction = MathFunction;
window.TestData = TestData;
// window.myChart = myChart;
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    BarController,
    PointElement,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  } from 'chart.js';
  
  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    BarController,
    PointElement,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );

  export const previewRight = document.getElementsByClassName('preview-right')[0];
  export const ptLabel = document.getElementById("ptLabel");


function clickHandler(click, mathF) {



    var clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
    });

    this.dispatchEvent(clickEvent);


    const points = this.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true);

    let newRightBar = document.getElementsByClassName('right-bar')[0];
    if(newRightBar) newRightBar.parentNode.removeChild(newRightBar);


    if(points.length) {

        const firstPoint = points[0];
        const value = this.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

        if(firstPoint.datasetIndex !== 0) {
            previewRight.style.display = 'none';
            

            let clickpt = new ClickPoint(mathF, value.x, this);
        }
    } else {
        previewRight.style.display = 'flex';
    }
}



document.addEventListener('DOMContentLoaded', loadgraph);
function loadgraph() {
    let splashscreen = document.getElementsByClassName('splash-screen')[0];
    
    // Ask people to put their phone or tablet sideways
    if(window.innerHeight > window.innerWidth) {
        let overlay = document.querySelector(".overlay");
        let splashCaption = document.querySelector("#splash-caption");
        let splashFooter = document.querySelector("#splash-footer");
        overlay.style.display = "flex";
        splashCaption.style.fontSize = "100%";
        splashCaption.innerHTML = "This app is best viewed with your tablet or device screen sideways (landscape). Tilt your screen and refresh the page"
        splashFooter.parentNode.removeChild(splashFooter);
    }

    const mainCanvas = document.getElementById('main-canvas');
    mainCanvas.style.width  = '80vw';
    mainCanvas.style.height = '80vh';
    const ctx = mainCanvas.getContext('2d');

    // show preview pane and hide feature pane
    previewRight.style.display = 'flex';

    const testf = new MathFunction();

    splashscreen.addEventListener('click', (event) => {
        event.currentTarget.style.display = 'none';
    })


    const myChart = new Chart(ctx, {
        type: 'scatter',
        plugins: [{
            afterDraw: chart => {

                testf.generateHoles().forEach((ele) => {
                    const statusBar = document.getElementById('status-bar');
                    if(ele.type === 'vertAsymp') drawVertLine.bind(myChart)(ele.x);

                }); // Draw vertical asymptotes

            // let ashley = document.getElementById('ashley');

            // if(ashley) {
            //     drawVertLine.bind(myChart)(ashley.style.left);
            //     console.log(ashley.style.left);
            //     let yAxis = chart.scales.y;
            //     let ctx = chart.ctx;
            //     ctx.save();
            //     ctx.fillText(`x = ${ashley.style.left}`, x, yAxis.bottom);
            //     ctx.beginPath();
            //     ctx.moveTo(x, yAxis.top);
            //     ctx.lineTo(x, yAxis.bottom);
            //     ctx.lineWidth = 2;
            //     ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
            //     ctx.stroke();
            //     ctx.restore();
            // }

            //   if (chart.tooltip?._active?.length) {
            //     let x = chart.tooltip._active[0].element.x;
            //     let y = chart.tooltip._active[0].element.y;
            //     let elem = chart.tooltip._active[0].element.$context.raw;


            //     // console.log(chart.tooltip._active[0].element.$context);
            //     if(x) {
            //         let yAxis = chart.scales.y;
            //         let ctx = chart.ctx;
            //         ctx.save();
            //         ctx.fillText(`x = ${elem.x}`, x, yAxis.bottom);
            //         ctx.beginPath();
            //         ctx.moveTo(x, yAxis.top);
            //         ctx.lineTo(x, yAxis.bottom);
            //         ctx.lineWidth = 2;
            //         ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
            //         ctx.stroke();
            //         ctx.restore();
            //     }

            //   }
            }
          }],
        data: {
            // labels: fineLabels,
            datasets: [{
                label: 'FineFunction',
                data: TestData.generatedataHashArray(fineLabels, testf.generatefineData()),
                showLine: true,

                pointStyle: 'circle',
                radius: 0,
                borderColor: "rgb(96, 96, 96, 1)",
                borderWidth: 3,
                pointHitRadius: 0
            },
            {
            label: 'DiscretePts',
            data: testf.generateDiscretePts(),
            showLine: false,

            pointStyle: 'circle',
            radius: 4,
            borderWidth: 3,
            pointHitRadius: 10,
            pointHoverRadius: 8,
            pointHoverBorderColor: 'rgb(104, 1, 104)',
            borderColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(0, 0, 1)",
            pointHitRadius: 10 // how close you have to click/tap to register as a click
        },

        {
            label: 'Holes',
            data: testf.generateHoles(),
            showLine: false,

            pointStyle: 'circle',
            radius: 4,
            pointHoverRadius: 8,
            pointHoverBorderColor: 'rgb(104, 1, 104)',
            borderWidth: 3,
            borderColor: "rgba(0, 0, 0, 1)",
            pointHitRadius: 10
        }
        
        ]
        },
        options: {
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            },
            responsive: true,
            scales: {
                x: {

                    min: -8,
                    afterBuildTicks: axis => axis.ticks = coarseLabels.map(v => ({ value: v })),
                    // ticks: {
                    // }

                }
            },

            elements: {
                point: {
                    radius: 1
                }

            }
        }
    });

    function clickHandlerWrapper(event) {
        return clickHandler.call(myChart, event, testf);
    }

    mainCanvas.addEventListener('click', clickHandlerWrapper); // (click) => {
        // clickHandler.bind(myChart)(click, testf);
    // });


//     window.addEventListener('resize', () => {
//         mainCanvas.removeEventListener('click', clickHandlerWrapper);
//         mainCanvas.addEventListener('click', clickHandlerWrapper);
//     // mainCanvas.removeEventListener('click', (click) => {
//     //     clickHandler.bind(myChart)(click, testf);
//     // }
//     // location.reload();
// });

}

