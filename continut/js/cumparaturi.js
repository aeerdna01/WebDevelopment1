var worker;

function startWorker() {
  console.log("Start worker...");
  if (typeof (Worker) !== "undefined") {
    if (typeof (w) == "undefined") {
      worker = new Worker("js/worker.js");
    }
  } else {
    console.log("Sorry! No Web Worker support.");
  }
}

function stopWorker() {
  worker.terminate();
  worker = undefined;
}

startWorker();
showTable();

function Produs(id, nume, cantitate) {
  this.id = id;
  this.nume = nume;
  this.cantitate = cantitate;
}

var AdaugaProdus = (event) => {
  event.preventDefault();

  var selectedOption = document.querySelector('input[name="localStorage"]:checked').value;
  console.log('dddd' + selectedOption);
  const nume = document.getElementById("nume").value;
  const cantitate = document.getElementById("cantitate").value;
  const id = Math.floor(Math.random() * 1000);
  const produs = new Produs(id, nume, cantitate);

  var promiseAdd = new Promise(function (resolve, reject) {
    let produse = localStorage.getItem("produse");
    if (produse == null) {
      produse = [];
    }
    else {
      produse = JSON.parse(produse);
    }

    produse.push(produs);

    var promiseStoring = new Promise(function (resolve, reject) {
      localStorage.setItem('produse', JSON.stringify(produse));
      resolve();
    });

    promiseStoring
      .then(function () {
        worker.postMessage('s-a apasat butonul adauga');
        console.log('cumparaturi.js => produsul a fost adaugat cu succes in local storage');

        worker.addEventListener('message', (event) => {
          var message = event.data;
          console.log('Received message from worker: ' + message);
          if (message == 'se poate adauga o linie in tabelul cu lista de cumparaturi') {
            loadTable(produse, true);
          }
        });
      })
      .catch(function (error) {
        console.log("Eroarea la adaugarea produsului: " + error);
      });
  });

  return promiseAdd;
}

var ProdusAdaugat = () => {
  const form = document.getElementById('myForm');
  form.addEventListener('submit', function (event) {
    AdaugaProdus(event)
      .then(function (message) {
        console.log(message);
      })
      .catch(function (error) {
        console.log(error);
      })
  });
}


function showTable() {
  var produse = localStorage.getItem("produse");
  produse = produse ? JSON.parse(produse) : [];
  loadTable(produse, false);
};

function loadTable(produse, updateTable) {
  let tabelProduse = document.getElementById('tabelProduse');

  if (updateTable === true) {
    while (tabelProduse.firstChild) {
      tabelProduse.removeChild(tabelProduse.firstChild);
    }
  }

  const thead = document.createElement('thead');
  const row1 = document.createElement('tr');
  const col1 = document.createElement('th');
  col1.textContent = 'ID';
  const col2 = document.createElement('th');
  col2.textContent = 'Nume';
  const col3 = document.createElement('th');
  col3.textContent = 'Cantitate';

  row1.appendChild(col1);
  row1.appendChild(col2);
  row1.appendChild(col3);

  thead.appendChild(row1);
  tabelProduse.appendChild(thead);

  const tbody = document.createElement('tbody');

  for (let p of produse) {
    const row2 = document.createElement('tr');
    row2.innerHTML = `<td>${p.id}</td><td>${p.nume}</td><td>${p.cantitate}</td>`;
    tbody.appendChild(row2);
  }

  tabelProduse.appendChild(tbody);
}