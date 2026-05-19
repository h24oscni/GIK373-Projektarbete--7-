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

hamburgerButton.addEventListener('click', () => {
  navMeny.classList.toggle('open');
});


// KAN SVERIGE NÅ TRANSPORTMÅLEN 2030?
// LINJEDIAGRAM ÖVER TID HUR UTSLÄPPEN SER UT

const urlTransportutsläpp = 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN';

const queryTransportutsläpp = {
  "query": [
    { "code": "Vaxthusgaser", "selection": { "filter": "item", "values": ["CO2-ekv."] } },
    { "code": "Transportslag", "selection": { "filter": "item", "values": ["8.0"] } },
    { "code": "Bransleslag", "selection": { "filter": "item", "values": ["0"] } }
  ],
  "response": { "format": "JSON" }
};

fetch(urlTransportutsläpp, {
  method: 'POST',
  body: JSON.stringify(queryTransportutsläpp)
}).then((res) => res.json())
  .then((data) => printTransport(data));

function printTransport(dataTransportSCB) {
  const years = dataTransportSCB.data;
  const labels = years.map((år) => år.key[3]);
  const data = years.map((type) => type.values[0]);

  const datasets = [{
    label: 'Mängden utsläpp per år',
    data,
    borderWidth: 2,
    borderColor: 'hsla(250, 100%, 30%, 1)',
    hoverBorderWidth: 4
  }];

  new Chart(document.getElementById('transportLine'), {
    type: 'line',
    data: { labels, datasets }
  });
}


// VILKET TRANSPORTSLAG SLÄPPER UT MEST?
// STAPELDIAGRAM

const urlTransportslag = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN";

const queryTransportslag = {
  "query": [
    { "code": "Vaxthusgaser", "selection": { "filter": "item", "values": ["CO2-ekv."] } },
    { "code": "Transportslag", "selection": { "filter": "item", "values": ["8.1", "8.2", "8.4", "8.5"] } },
    { "code": "Bransleslag", "selection": { "filter": "item", "values": ["0"] } }
  ],
  "response": { "format": "JSON" }
};

fetch(urlTransportslag, {
  method: 'POST',
  body: JSON.stringify(queryTransportslag)
}).then((res) => res.json())
  .then((data) => printTransportslag(data));

function printTransportslag(data) {
  const senasteAr = data.data.filter((row) => row.key[3] === '2023');

  const transportslagName = {
    '8.1': 'Flyg',
    '8.2': 'Järnväg',
    '8.4': 'Sjöfart',
    '8.5': 'Vägtrafik'
  };

  const labels = senasteAr.map((row) => transportslagName[row.key[1]]);
  const values = senasteAr.map((row) => parseFloat(row.values[0]));

  new Chart(document.getElementById('transportslagChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Utsläpp 2023 (kt CO2-ekv.)',
        data: values,
        backgroundColor: ['#52b788', '#2d6a4f', '#95d5b2', '#1a3a2a'],
        borderWidth: 2
      }]
    }
  });
}


// TRANSPORTUTSLÄPP VÄGTRAFIK

const urlVagtrafik = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/MI0107InTranspNN";

const queryVagtrafik = {
  "query": [
    { "code": "Vaxthusgaser", "selection": { "filter": "item", "values": ["CO2-ekv."] } },
    { "code": "Transportslag", "selection": { "filter": "item", "values": ["8.5.1", "8.5.11", "8.5.2", "8.5.3", "8.5.4", "8.5.7"] } },
    { "code": "Bransleslag", "selection": { "filter": "item", "values": ["0"] } }
  ],
  "response": { "format": "JSON" }
};

fetch(urlVagtrafik, {
  method: 'POST',
  body: JSON.stringify(queryVagtrafik)
}).then((res) => res.json())
  .then((data) => printVagtrafik(data));

function printVagtrafik(data) {
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
  const values = senasteAr.map((row) => parseFloat(row.values[0]));

  new Chart(document.getElementById('vagtrafikChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Utsläpp 2023 (kt CO2-ekv.)',
        data: values,
        backgroundColor: ['#52b788', '#2d6a4f', '#95d5b2', '#1a3a2a'],
        borderWidth: 2
      }]
    }
  });
}


// HUR STOR DEL AV SVERIGES KLIMATUTSLÄPP KOMMER FRÅN TRANSPORTER?
// DONUTDIAGRAM

const urlTotalt = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0107/TotaltUtslappN";

const queryTotalt = {
  "query": [
    { "code": "Vaxthusgaser", "selection": { "filter": "item", "values": ["CO2-ekv."] } },
    { "code": "Sektor", "selection": { "filter": "item", "values": ["0.1"] } }
  ],
  "response": { "format": "JSON" }
};

async function beraknaTransportAndel() {
  const dataTotalt = await fetch(urlTotalt, {
    method: 'POST',
    body: JSON.stringify(queryTotalt)
  }).then((res) => res.json());

  const dataTransport = await fetch(urlTransportutsläpp, {
    method: 'POST',
    body: JSON.stringify(queryTransportutsläpp)
  }).then((res) => res.json());

  const totaltValues = dataTotalt.data.map((row) => row.values[0]);
  const transportValues = dataTransport.data.map((row) => row.values[0]);

  const totalt = parseFloat(totaltValues[totaltValues.length - 1]);
  const transport = parseFloat(transportValues[transportValues.length - 1]);
  const ovrigt = totalt - transport;

  createDonut(transport, ovrigt);
}
beraknaTransportAndel();

function createDonut(transport, ovrigt) {
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


// TILL TOPPEN KNAPP
const toTopButton = document.getElementById('tillToppen');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    toTopButton.style.display = 'flex';
  } else {
    toTopButton.style.display = 'none';
  }
});

toTopButton.addEventListener('click', () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});


// VISA SIDA FRÅN KNAPP
function visaSida(pageId) {
  pages.forEach((p) => p.classList.remove('active'));
  navLinks.forEach((l) => l.classList.remove('active'));

  document.getElementById('page-' + pageId).classList.add('active');

  const aktivLank = document.querySelector('[data-page="' + pageId + '"]');
  if (aktivLank) aktivLank.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}