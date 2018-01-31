import Chart from 'chart.js';
import * as R from 'ramda';

const drawLine = (data, labels) => {
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'sleep intensity',
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)"
      }]
    },
    options: {
      scales: {
        yAxes: [{
          labelString: "Intensity"
        }],
        xAxes: [{
          labelString: "Time"
        }]
      }
    }
  });
};

fetch('http://localhost:8080/session/1', { method: 'get' }).then(function(response) {
  return response.json();
}).then(function(j) {
  console.log(j); 

  const intensitys = R.map(R.prop('intensity'), j.events);
  const times = R.map(R.prop('time'), j.events);

  drawLine(intensitys, times);
}).catch((error) => {
  console.error(error);
});
