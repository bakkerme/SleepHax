import Chart from 'chart.js';
import * as R from 'ramda';
import moment from 'moment';

const dataToTime = R.compose((t) => moment.unix(t).format('h:mm'), R.prop('time'));

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
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        pointRadius: 0
      }]
    },
    options: {
      scales: {
        yAxes: [{
          labelString: "Intensity"
        }],
        xAxes: [{
          labelString: "Time",
        }]
      }
    }
  });
};

fetch('http://localhost:8080/session/100', { method: 'get' }).then(function(response) {
  return response.json();
}).then(function(j) {
  console.log(j); 

  const values = R.values(j.events);

  const intensitys = R.map(R.prop('intensity'), values);
  const times = R.map(dataToTime, values);

  drawLine(intensitys, times);
}).catch((error) => {
  console.error(error);
});
