onmessage = (event) => {
    console.log("Message received from main script => " + event.data);
    const workerResult = "se poate adauga o linie in tabelul cu lista de cumparaturi";
    console.log("Posting message back to main script => " + workerResult);
    postMessage(workerResult);
};
  