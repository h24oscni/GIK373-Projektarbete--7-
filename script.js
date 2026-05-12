// NAVIGERING

const navLinks = document.querySelectorAll(".nav-link-custom");
const pages = document.querySelectorAll(".page");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    pages.forEach((p) => p.classList.remove("active"));

    link.classList.add("active");
    document.getElementById("page-" + link.getAttribute("data-page")).classList.add("active");
  });
});


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


// VÅR

const urlTransportutsläpp =
  'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN';

const queryTransportutsläpp =
  {
    "query": [
      {
        "code": "Vaxthusgaser",
        "selection": {
          "filter": "item",
          "values": [
            "CO2-ekv."
          ]
        }
      },
      {
        "code": "Transportslag",
        "selection": {
          "filter": "item",
          "values": [
            "8.0"
          ]
        }
      },
      {
        "code": "Bransleslag",
        "selection": {
          "filter": "item",
          "values": [
            "0"
          ]
        }
      }
    ],
    "response": {
      "format": "JSON"
    }
  }

const requestTransportutsläpp = new Request(urlTransportutsläpp, {
  method: 'POST',
  body: JSON.stringify(queryTransportutsläpp)
});

console.log(requestTransportutsläpp);

fetch(requestTransportutsläpp)
  .then((response) => response.json())
  .then((data) => printTransport(data));

function printTransport(dataTransportSCB) {
  console.log(dataTransportSCB);

  const years = dataTransportSCB.data;
  console.log(years);

  const labels = years.map((år) => år.key[3]);
  console.log(labels);

  const data = years.map((type) => type.values[0]);
  console.log(data);

  const datasets = [
    {
      label: 'Mängden utsläpp per år',
      data,
      borderWidth: 2,
      borderColor: 'hsla(250, 100%, 30%, 1)',
      hoverBorderWidth: 4
    }
  ];

  new Chart(document.getElementById('transport'), {
    type: 'bar',
    data: { labels, datasets }
  });

}
  


