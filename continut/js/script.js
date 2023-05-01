/* invat.html #section1 */
function getInfo() {
    var date = new Date();

    var timpCurent = document.getElementById("timpCurent");
    timpCurent.innerHTML = "Data si ora curente: " + date.toString();

    var adresaMea = document.getElementById("adresaMea");
    adresaMea.innerHTML = "Adresa URL: " + window.location.href;

    var locatiaCurenta = document.getElementById("locatiaCurenta");
    navigator.geolocation.getCurrentPosition(function (position) {
        locatiaCurenta.innerHTML = "Locatia curenta: " + position.coords.latitude + ", " + position.coords.longitude;
    });

    var browser = document.getElementById("browser");
    browser.innerHTML = "Browser si sistem de operare: " + window.navigator.userAgent;
}

/* invat.html #section2 */
var x1 = -1, y1 = -1;

function loadCanvaImage() {
    var img = new Image();
    var c = document.getElementById("desen");
    var ctx = c.getContext("2d");
    img.onload = function () {
        ctx.drawImage(img, 0, 0, c.width, c.height);
    }
    img.src = "imagini/portativ.png";
}

function drawCanva(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    let min_x = Math.min(x, x1);
    let min_y = Math.min(y, y1);

    var c = document.getElementById("desen");
    var ctx = c.getContext("2d");

    if (x1 == -1) {
        x1 = x;
        y1 = y;
    } else {
        let strokeColor = document.getElementById("stroke-color").value;
        let fillColor = document.getElementById("fill-color").value;
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.fillRect(min_x, min_y, Math.abs(x - x1), Math.abs(y - y1));
        ctx.strokeRect(min_x, min_y, Math.abs(x - x1), Math.abs(y - y1));
        x1 = y1 = -1;
    }
}

/* invat.html #section3 */
function addRow() {
    var rand = document.getElementById("position-row").value;
    var culoare = document.getElementById("color").value;

    var tabel = document.getElementById("myTable");
    var numarRanduri = tabel.rows.length;

    if (rand < 1 || rand > numarRanduri + 1) {
        alert("Optiune invalida!");
        return;
    }

    var randNou = tabel.insertRow(rand);
    for (var i = 0; i < tabel.rows[0].cells.length; i++) {
        var celulaNoua = randNou.insertCell(i);
        celulaNoua.style.backgroundColor = culoare;
    }
}

function addColumn() {
    var coloana = document.getElementById("position-column").value;
    var culoare = document.getElementById("color").value;

    var tabel = document.getElementById("myTable");
    var numarColoane = tabel.rows[0].cells.length;

    if (coloana < 1 || coloana > numarColoane + 1) {
        alert("Optiune invalida!");
        return;
    }

    for (var i = 0; i < tabel.rows.length; i++) {
        var randCurent = tabel.rows[i];
        var celulaNoua = randCurent.insertCell(coloana);
        celulaNoua.style.backgroundColor = culoare;
    }
}

/* index.html */
function schimbaContinut(resursa, jsFisier = "", jsFunctie = "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML = this.responseText;
            if (resursa == "invat") {
                getInfo();
                loadCanvaImage();
            }
            else if (resursa == "inregistreaza") {
                showAge();
                submitForm();
                processForm();
            }
        }
    };

    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();

    if (jsFisier != "") {
        var elementScript = document.createElement('script');
        elementScript.onload = function () {
            if (jsFunctie) {
                window[jsFunctie]();
            }
        };
        elementScript.src = jsFisier;
        document.head.appendChild(elementScript);
    }
    else {
        if (jsFunctie != "") {
            window[jsFunctie]();
        }
    }
}

/* verifica.html */
function verificaUtilizator() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var result = document.getElementById("rezultat");
    result.className = "section-card";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var utilizatori = JSON.parse(this.responseText);
            var gasit = false;
            console.log(utilizatori);
            for (var i = 0; i < utilizatori.length; i++) {
                if (utilizatori[i].nume_utilizator == username && utilizatori[i].parola == password) {
                    gasit = true;
                    break;
                }
            }
            if (gasit) { 
                result.style.color = "green";
                result.style.fontStyle = "italic";
                result.style.fontWeight = "bold"
                result.innerHTML = "Autentificare validă!";
            } else {
                result.style.color = "red";
                result.style.fontStyle = "italic";
                result.style.fontWeight = "bold"
                result.innerHTML = "Autentificare invalidă!";
            }
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}

/* inregistreaza.html */
function showAge(){
    const rangeInput = document.getElementById("varsta");
    const selectedValue = document.getElementById("varsta-selectata");
    selectedValue.style.textAlign = "center";
    rangeInput.addEventListener("input",() =>{
        selectedValue.textContent = rangeInput.value;
    });
}

function submitForm() {
    const checkbox = document.getElementById('acord');
    const submitButton = document.getElementById('submit');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
}

function processForm() {
    var form = document.getElementById('inregistrare');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nume_utilizator = document.getElementById('nume_utilizator').value;
        var parola = document.getElementById('parola').value;
        var nume = document.getElementById('nume').value;
        var prenume = document.getElementById('prenume').value;
        var email = document.getElementById('email').value;
        var telefon = document.getElementById('telefon').value;
        var perioada_muzicala = document.getElementById('perioada_muzicala').value;
        var melodie_preferat = document.getElementById('melodie_preferat').value;
        var an_lansare = document.getElementById('an_lansare').value;
        var sex = document.getElementById('sex').value;
        var culoare = document.getElementById('culoare').value;
        var data_nasterii = document.getElementById('data_nasterii').value;
        var ora_nasterii = document.getElementById('ora_nasterii').value;
        var varsta = document.getElementById('varsta').value;
        var pagina_personala = document.getElementById('pagina_personala').value;
        var feedback = document.getElementById('descriere').value;
        console.log(feedback);

        fetch('api/utilizatori', {
            method: 'POST',
            body: JSON.stringify({
                nume_utilizator: nume_utilizator,
                parola: parola,
                nume: nume,
                prenume: prenume,
                email: email,
                telefon: telefon,
                perioada_muzicala: perioada_muzicala,
                melodie_preferat: melodie_preferat,
                an_lansare: an_lansare,
                sex: sex,
                culoare: culoare,
                data_nasterii: data_nasterii,
                ora_nasterii: ora_nasterii,
                varsta: varsta,
                pagina_personala: pagina_personala,
                feedback: feedback
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            console.log(data)
        }).catch(error => console.error('Error:', error));
        window.location.reload();
    });
}
