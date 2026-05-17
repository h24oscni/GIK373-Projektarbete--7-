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

// HAMBURGARE NAVIGERING

const hamburgerButton = document.getElementById('hamburger');
const navMeny = document.getElementById('navLinks');

hamburgerButton.addEventListener('click', () =>{
  navMeny.classList.toggle('open');
})


// KAN SVERIGE NÅ TRANSPORTMÅLEN 2030?
// LINJEDIAGRAM ÖVER TID HUR UTSLÄPPEN SER UT

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
  body: JSON.stringify(queryTransportutsläpp),
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

  new Chart(document.getElementById('transportLine'), {
    type: 'line',
    data: { labels, datasets }
  });
}
  
// VILKET TRANSPORTMEDEL SLÄPPER UT MEST?
// STAPELDIAGRAM

// TRANSPORTUTSLÄPP ALLA TRANSPORTSLAG

const urlTransportslag = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN";

const queryTransportslag = 
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
          "8.1",
          "8.2",
          "8.4",
          "8.5"
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

const requestTransportslag = new Request(urlTransportslag, {
  method: 'POST',
  body: JSON.stringify(queryTransportslag)
});

console.log(requestTransportslag);

fetch(requestTransportslag)
  .then((response) => response.json())
  .then((data) => printTransportslag(data));


function printTransportslag(data) {
  console.log(data);

  const senasteAr = data.data.filter((row) => row.key[3] === '2023');

  const transportslagName = {
    '8.1': 'Flyg',
    '8.2': 'Järnväg',
    '8.4': 'Sjöfart',
    '8.5': 'Vägtrafik'
  };
  const labels = senasteAr.map((row) => transportslagName[row.key[1]]);
  const values = senasteAr.map((row) => parseFloat(row.values [0]));

  console.log(labels);
  console.log(values);

  new Chart(document.getElementById('transportslagChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Utsläpp 2023 (kt C02-ekv.)',
        data: values,
        backgroundColor: ['#52b788', '#2d6a4f', '#95d5b2', '#1a3a2a'],
        borderWidth: 2
      }]
    }
  });
}

// TRANSPORTUTSLÄPP VÄGTRAIK

const urlVagtrafik = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN";

const queryVagtrafik = 
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
          "8.5.1",
          "8.5.11",
          "8.5.2",
          "8.5.3",
          "8.5.4",
          "8.5.7"
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

const requestVagtrafik = new Request(urlVagtrafik, {
  method: 'POST',
  body: JSON.stringify(queryVagtrafik)
});

fetch(requestVagtrafik)
  .then((response) => response.json())
  .then((data) => printVagtrafik(data));

function printVagtrafik(data) {
  console.log(data.data[0]);

  const senasteAr = data.data.filter((row) => row.key[3] === '2023');
  
  const transportslagName = {
    '8.5.1': 'Personbilar',
    '8.5.11': 'Mopeder och motorcyklar',
    '8.5.2': 'Bussar',
    '8.5.3': 'Lätta lastbilar',
    '8.5.4': 'Tunga lastbilar',
    '8.5.7': 'A-traktorer'
  };
  const labels = senasteAr.map((row) => transportslagName[row.key[1]]);
  const values = senasteAr.map((row) => parseFloat(row.values [0]));
  
  console.log(labels);
  console.log(values);
  
  new Chart(document.getElementById('vagtrafikChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
      label: 'Utsläpp 2023 (kt C02-ekv.)',
      data: values,
      backgroundColor: ['#52b788', '#2d6a4f', '#95d5b2', '#1a3a2a'],
      borderWidth: 2
      }]
    }
  });
}


// HUR STÅR SIG SVERIGE JÄMFÖRT MED ÖVRIGA EUROPA?
// UTSLÄPP BEROENDE PÅ LÄN, OM VI HITTAR DATABAS


// HUR STOR DEL AV SVERIGES KLIMATUTSLÄPP KOMMER FRÅN TRANSPORTER??
// DONUTDIAGRAM

const urlTotalt = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/TotaltUtslappN";

const queryTotalt = 
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
      "code": "Sektor",
      "selection": {
        "filter": "item",
        "values": [
          "0.1"
        ]
      }
    }
  ],
  "response": {
    "format": "JSON"
  }
}

const requestTotalt = new Request(urlTotalt, {
  method: 'POST',
  body: JSON.stringify(queryTotalt),
});

function printTotalt(dataTotaltSCB) {
  console.log(dataTotaltSCB);
  
  const values = dataTotaltSCB.data.map((row) => row.values[0]);
  const years = dataTotaltSCB.data.map((data) => data.key[2]);
  console.log(values);
  console.log(years);
}

Promise.all([
  fetch(urlTotalt, {
      method: 'POST',
      body: JSON.stringify(queryTotalt)
  }).then((res) => res.json()),
  fetch(urlTransportutsläpp, {
      method: 'POST',
      body: JSON.stringify(queryTransportutsläpp)
  }).then((res) => res.json())
]).then(([dataTotalt, dataTransport]) => {

  const totaltValues = dataTotalt.data.map((row) => row.values[0]);
  const transportValues = dataTransport.data.map((row) => row.values[0]);

  const totalt = parseFloat(totaltValues[totaltValues.length - 1]);
  const transport = parseFloat(transportValues[transportValues.length - 1]);
  const ovrigt = totalt - transport;

  console.log(totalt);
  console.log(transport);
  console.log(ovrigt);

  createDonut(transport, ovrigt);
});

function createDonut(transport, ovrigt){
  new Chart(document.getElementById('transportDonut'), {
    type: 'doughnut',
    data: {
      labels: ['Transporter', 'Övriga utsläpp'],
      datasets: [{
        data: [transport, ovrigt],
        backgroundColor: ['#2d6a4f', '#d8f3dc'],
        borderWidth: 2
      }]
    }
  });
}