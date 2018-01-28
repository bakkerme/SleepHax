import Chart from 'chart.js';
import r from 'rambda';

const drawLine = (data) => {
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'sleep intensity',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
};

fetch('http://localhost:8080/session/1', { method: 'get' }).then(function(response) {
  return response.json();
}).then(function(j) {
  console.log(j); 

  const intensitys = r.map(j.events, (v) => {
    return v.intensity;
  });

  drawLine(intensitys);
}).catch((error) => {
  console.error(error);
});
