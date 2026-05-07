//Lektion 1 
const labels = [
    'Avesta',
    'Borlänge',
    'Falun',
    'Hedemora',
    'Ludvika',
    'Säter',
    'Mora'
  ];
  
  const datasets = [
    {
      label: 'Befolkning i Dalarna 2023',
      data: [22932, 52178, 59818, 15443, 26353, 11271, 20679],
      backgroundColor: 'rgba(244,255,12, 0.4)',
      borderWidth: 2,
      borderColor: 'black',
      hoverBorderWidth: 4
    },
    {
      label: 'Befolkning 2023',
      data: [22753, 51735, 59986, 15345, 26402, 11243, 20536],
      backgroundColor: 'rgba(34,255,12, 0.4)',
      borderWidth: 2,
      borderColor: 'black',
      hoverBorderWidth: 4
    }
  ];
  
  const data = { labels: labels, datasets: datasets };
  
  const config = { type: 'bar', data: data, options: {} };
  
  const canvasElement = document.getElementById('myChart');
  
  const myChart = new Chart(canvasElement, config);
  
//Lektion 2

