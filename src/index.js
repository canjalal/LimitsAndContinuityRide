// import "./scripts/styles/reset.css"
const TestData = require("./scripts/testdata.js");
const { MathFunction, coarseLabels, fineLabels } = require("./scripts/mathfunction");
const { regNode, vertAsympNode, removDisNode, justDisNode } = require("./scripts/pointnode");
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

    function drawVertLine(chart, x) {

            let ctx = chart.ctx;

            let xAxis = chart.scales.x
            let yAxis = chart.scales.y;

            let xpos = xAxis.getPixelForValue(x);
            // console.log(xpos);
            ctx.save();
            ctx.font = '18px sans-serif';
            ctx.fillText(`x = ${x}`, xpos - 18, yAxis.bottom - 10);
            ctx.beginPath();
            ctx.setLineDash([5, 15]);
            ctx.moveTo(xpos, yAxis.top);
            ctx.lineTo(xpos, yAxis.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
            ctx.stroke();
            ctx.restore();
            ctx.setLineDash([]);

    }


    const myChart = new Chart(ctx, {
        type: 'scatter',
        plugins: [{
            afterDraw: chart => {

                testf.generateHoles().forEach((ele) => {
                    if(ele.type === 'vertAsymp') drawVertLine(chart, ele.x);

                });

                // for(let x = i)
              if (chart.tooltip?._active?.length) {
                let x = chart.tooltip._active[0].element.x;
                let y = chart.tooltip._active[0].element.y;
                let elem = chart.tooltip._active[0].element.$context.raw;


                // console.log(chart.tooltip._active[0].element.$context);
                // if(x) {
                //     let yAxis = chart.scales.y;
                //     let ctx = chart.ctx;
                //     ctx.save();
                //     ctx.fillText(`x = ${elem.x}`, x, yAxis.bottom);
                //     ctx.beginPath();
                //     ctx.moveTo(x, yAxis.top);
                //     ctx.lineTo(x, yAxis.bottom);
                //     ctx.lineWidth = 2;
                //     ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
                //     ctx.stroke();
                //     ctx.restore();
                // }

              }
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
            backgroundColor: "rgba(0, 0, 1)"
        },

        {
            label: 'Holes',
            data: testf.generateHoles(),
            showLine: false,

            pointStyle: 'circle',
            radius: 4,
            borderWidth: 3,
            borderColor: "rgba(0, 0, 0, 1)"
        }

        
        
        ]
        },
        options: {
            plugins: { tooltip: { enabled: false } },

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


    console.log(myChart);

    function clickHandler(click) {
        const points = myChart.getElementsAtEventForMode(click, 'nearest', {intersect: true}, true);
        if(points.length) {
            const firstPoint = points[0];
            console.log(firstPoint);
            const value = myChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
            // console.log(firstPoint.datasetIndex);

            if(firstPoint.datasetIndex !== 0) {
                console.log(value.type);
            }
            // console.log(value.y);
        }
    }

    document.addEventListener('click', clickHandler);

    // drawVertLine(myChart, 5);

    // console.log(TestData.generatedataHash(fineLabels, testf.generatefineData()));

});