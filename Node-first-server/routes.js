const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url; //In questo modo analizziamo l'URL della richiesta
  const method = req.method; //In questo modo analizziamo il metodo di inoltro
  //della richiesta.
  if (url === "/") {
    //Questo ci dice che quando viene indirizzato 'localhost:3000/'
    //dobbiamo stampare la pagina che sta all'interno dell' if.
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end(); //Il return serve solo per fare finire la funzione anonima.
    //In questo modo non usiamo il codice dopo. Dobbiamo usarlo!
  }
  if (url === "/message" && method === "POST") {
    //Se l'ULR ha come route '/message' e come
    //metodo 'POST'.
    const body = []; //Creiamo un array constant, perchè non vogliamo
    //sovrascriverlo con nessun altro array, ma
    //vogliamo solo modificare i valori al suo interno.
    req.on("data", (chunk) => {
      //Qui stiamo specificando dei listener
      //su dei dati in arrivo. I dati arrivano
      //in chunck separati, quindi quello che
      //facciamo, è raggrupparli tutti assieme
      //all'interno di body.
      console.log(chunk);
      body.push(chunk);
    }); //Sto dicendo a che evento devo stare pronto ad ascoltare
    return req.on("end", () => {
      //Finita la ricezione dei chunk, andiamo a
      //concatenarli tutti, e a trasformarli in stringhe,
      //per poi splittare tramite l'uguale il dato ottenuto
      //e prendere solo la seconda parte.
      //Es, 'message=vero_messaggio', a noi interessa vero_messaggio.
      //IMPORTANTE: utilizziamo il return, per assicurarci che venga
      //eseguito prima della seconda parte il codice al suo interno.
      console.log(body);
      const parsedBody = Buffer.concat(body).toString(); //Sappiamo già che è una stringa
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      //fs.writeFileSync('message.txt',message); //Scriviamo un file con quanto estratto dal messaggio.
      //writeFileSync andrà a bloccare l'esecuzione del codice,
      //finchè non viene creato e scritto.
      //Quindi è una bloccante! E potrebbe andare a bloccare
      //anche le richieste degli altri utenti.
      fs.writeFile("message.txt", message, (err) => {
        //Il terzo parametro è una funzione di callback,
        //che esegue codice quando ha finito di scrivere.
        //Gli viene passato un parametro in caso di errore.
        //(adesso non faremo error handling però).
        res.statusCode = 302; //Impostiamo lo status code dell'intestazione a 302 (codice per il redirect)
        res.setHeader("Location", "/"); //Diamo la location per il redirect settando
        //l'header.
        return res.end();
      });
    });
  }
  //Questa pagina costruita qui sotto, funzionerà solo se la parte sopra
  //non viene eseguita (perchè esegue il return). Quindi possiamo dire che è
  //come una route di default.

  res.setHeader("Content-Type", "text/html"); //Stiamo dando un header che specifica
  //che il contenuto della nostra pagina
  //è del tipo text/html.
  res.write("<html>"); //Con write possiamo scrivere la pagina stessa.
  //ovviamente è veramente molto strano e non
  //leggibile come modo per scrivere una pagina,
  //però per adesso questo è come si fa.
  res.write("<head><title>my first page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</head></body>");
  res.write("</html>");
  res.end(); //Qui chiudiamo la gestione della risposta, tutto
  //quello che faremo d'ora in poi, che va a modificare
  //la risposta in se, genererà un errore.
};

module.exports = requestHandler; 
//In questo modo, all'interno di module.exports, troverò la mia funzione
//per l'handling delle routes, all'interno dell'altro file, richiedendola.

//Si può fare anche così:
//module.exports.handler = requestHandler;

//Un'altro modo per esportare è quello di passare più cose con lo stesso
//module exports:
//module.exports = {
//  handling: requestHandler,
//  someText: "some random text"
//};

//Usando questo modo però, dall'altra parte dovremo utilizzare gli
//attributi dell'oggetto che passiamo, poichè appunto stiamo passando
//un oggetto.