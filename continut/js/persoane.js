function incarcaPersoane() {
    console.log("Incarca persoane...");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            text = this.responseXML;
            persons = text.getElementsByTagName("persoana");
            
            var htmlTableContent = "<br>" + "<h3 class='custom-h3'>Persoane abonate</h3>"
            htmlTableContent +=
                "<table>" +
                "<tr>" +
                "<th>Nume</th>" +
                "<th>Prenume</th>" +
                "<th>Varsta</th>" +
                "<th>Adresa</th>" +
                "<th>CV</th>" +
                "</tr>";

            for (var index = 0; index < persons.length; index++) {
                pers = persons[index];
                var adresa = pers.getElementsByTagName("adresa")[0];
                var educatie = pers.getElementsByTagName("educatie")[0];
                htmlTableContent +=
                    "<tr>" +
                    "<td>" + pers.getElementsByTagName("nume")[0].textContent + "</td>" +
                    "<td>" + pers.getElementsByTagName("prenume")[0].textContent + "</td>" +
                    "<td>" + pers.getElementsByTagName("varsta")[0].textContent + "</td>" +
                    "<td>" + adresa.getElementsByTagName("strada")[0].textContent + ", " + adresa.getElementsByTagName("numar")[0].textContent + ", " + adresa.getElementsByTagName("localitate")[0].textContent + ", " + adresa.getElementsByTagName("judet")[0].textContent + ", " + adresa.getElementsByTagName("tara")[0].textContent + "</td>" +
                    "<td>" + educatie.getElementsByTagName("facultate")[0].textContent + ", " + educatie.getElementsByTagName("liceu")[0].textContent + "</td>" +
                    "</tr>";
            }

            htmlTableContent += "</table>";
            document.getElementById("incarcaPersoane").innerHTML = htmlTableContent;
        }
    };

    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}
