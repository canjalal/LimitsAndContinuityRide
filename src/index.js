// import "./scripts/styles/reset.css"
const TestData = require("./scripts/testdata.js");
const { MathFunction, coarseLabels, fineLabels } = require("./scripts/mathfunction");
const { regNode, vertAsympNode, removDisNode, justDisNode } = require("./scripts/pointnode");
window.MathFunction = MathFunction;
window.TestData = TestData;
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

  function clickHandler(click) { // click is an event
      const points = myChart.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true);
  }

document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    mainCanvas.width = 800;
    mainCanvas.height = 600;
    mainCanvas.style.width  = '800px';
    mainCanvas.style.height = '600px';
    const ctx = mainCanvas.getContext('2d');
    console.log(ctx);

    const testf = new MathFunction();
    // console.log(testf.generatefineData().length);

    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            // labels: fineLabels,
            datasets: [{
                label: 'FineFunction',
                data: TestData.generatedataHashArray(fineLabels, testf.generatefineData()),
                showLine: true,

                pointStyle: 'circle',
                radius: 0,
                borderWidth: 4
            },
            {
            label: 'DiscretePts',
            data: testf.generateDiscretePts(),
            showLine: false,

            pointStyle: 'circle',
            radius: 5,
            borderWidth: 4,
            hitRadius: 2,
            borderColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(0, 0, 1)"
        },

        {
            label: 'Holes',
            data: testf.generateHoles(),
            showLine: false,

            pointStyle: 'circle',
            radius: 5,
            borderWidth: 4,
            borderColor: "rgba(0, 0, 0, 1)"
        }

        
        
        ]
        },
        options: {
            responsive: false,
            scales: {
                x: {

                    min: -10,
                    afterBuildTicks: axis => axis.ticks = coarseLabels.map(v => ({ value: v })),
                    ticks: {
                    // callback: function(value, index, values) {
                    //     return this.getLabelForValue(value);
                    //         }
                        // maxTicksLimit: coarseLabels.length,
                        // stepSize: 1,
                        // autoSkip: false,
                        // callback: value => coarseLabels.includes(value) ? value : ''


                        // source: 'data'
                    }

                }
            //     y: {
            //         beginAtZero: true
            //     }
            },

            elements: {
                point: {
                    radius: 1
                }

            }
        }
    });

    // console.log(TestData.generatedataHash(fineLabels, testf.generatefineData()));

});