const TestData = require("./scripts/testdata.js");
const { MathFunction, coarseLabels, fineLabels } = require("./scripts/mathfunction");
const { regNode, vertAsympNode, removDisNode, justDisNode } = require("./scripts/pointnode");
window.MathFunction = MathFunction;
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

document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    const ctx = mainCanvas.getContext('2d');
    console.log(ctx);

    const testf = new MathFunction();

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fineLabels,
            datasets: [{
                label: 'Sin X',
                data: testf.generatefineData(),
                fillColor: "rgba(220, 220, 220, 0.2)",
                strokeColor: "rgba(220, 220, 2220, 1)",
                // pointColor: "rgba(220, 220, 220, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220, 220, 220, 1)"
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                    // callback: function(value, index, values) {
                    //     return this.getLabelForValue(value);
                    //         }
                        maxTicksLimit: coarseLabels.length
                    }

                }
            //     y: {
            //         beginAtZero: true
            //     }
            },

            elements: {
                point: {
                    radius: 0
                }

            }
        }
    });

    // console.log(TestData.coarseLabels);

});