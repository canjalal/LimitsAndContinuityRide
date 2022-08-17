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

  export const rightBar = document.getElementsByClassName("right-bar")[0];


function clickHandler(click, mathF) {
    const points = this.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true);

    let newRightBar = document.getElementsByClassName('right-bar')[0];
    if(newRightBar) newRightBar.parentNode.removeChild(newRightBar);


    if(points.length) {
        const firstPoint = points[0];
        // console.log(firstPoint);
        const value = this.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        // console.log(firstPoint.datasetIndex);

        if(firstPoint.datasetIndex !== 0) {
            // console.log(value.type);
            // console.log(value.x)
            previewRight.style.display = 'none';
            

            let clickpt = new ClickPoint(mathF, value.x, this);
            // console.log(clickpt);
            // a.destroy();
        }
        // console.log(value.y);
    } else {
        previewRight.style.display = 'flex';
    }
}

window.addEventListener('resize', () => {
    location.reload();
});

document.addEventListener('DOMContentLoaded', loadgraph);
function loadgraph() {
    let splashscreen = document.getElementsByClassName('splash-screen')[0];    

    const mainCanvas = document.getElementById('main-canvas');
    // mainCanvas.width = 800;
    // mainCanvas.height = 600;
    mainCanvas.style.width  = '80vw';
    mainCanvas.style.height = '80vh';
    const ctx = mainCanvas.getContext('2d');

    // show preview pane and hide feature pane
    previewRight.style.display = 'flex';
    // console.log(ctx);

    const testf = new MathFunction();
    // console.log(testf.generatefineData().length);
    setTimeout(() => {
        splashscreen.style.display = 'none';
    }, 1000);
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
            hitRadius: 2,
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

            responsive: false,
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


    console.log(myChart);


    mainCanvas.addEventListener('click', (click) => {
        clickHandler.bind(myChart)(click, testf);
    });



    // drawVertLine(myChart, 5);

    // console.log(TestData.generatedataHash(fineLabels, testf.generatefineData()));

}

