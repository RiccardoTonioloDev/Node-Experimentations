const http = require("http"); //Modo per importare file in Node
// const routes = require("./routes"); //C'è il './' appunto perchè routes (rimosso)
//non è un file disponibile a livello
//globale.

const express = require('express'); //importiamo express
const app = express(); //In questo modo inizializziamo un oggetto per fare si che
                       //express riesca a gestire per noi un bel po' di cose
                       //dietro le quinte.

//const { removeListener } = require('process');
//Per importare moduli non globali però,
//all'inizio del nome del modulo, serve
//usare il './' !

//function rqListener(req,res){}

//http.createServer(removeListener); //Bisogna passare come parametro alla
//funzione createServer(), una funzione
//che verrà eseguita ogni volta che verrà
//eseguita una richiesta al server.
//A questa funzione, per ogni richiesta,
//verranno passati 2 parametri:
//1) Dati di entrata (req);
//2) Dati di uscita (res).
//Sono le variabili con cui è possibile
//gestire le richieste in entrata, e le
//loro relative risposte.

//Possiamo fare lo stesso anche con funzioni anonime

//La funzione createServer(), applicata all'oggetto http, ci restituisce
//un oggetto server. Per questo lo assegnamo a una variabile di tipo
//const: poichè non abbiamo intenzione di andare a modificarla.
//const server = http.createServer(routes); //Se arriva una richiesta, viene usata la funzione
                                          //creata in routes. I parametri req e res vengono
                                          //direttamente passati alla funzione.
                                          //Infatti nell'altro file abbiamo esportato la
                                          //funzione, che richiede quei due parametri.
                                          //Allo stesso modo, li è implicita la richiesta
                                          //di parametri (rimosso)

//app.use((req, res, next)=>{ //Questo è il primo middleware
                            //Definiamo quindi, come gestire una qualsiasi richiesta
                            //entrante, definendo i middleware tramite ".use", dove
                            //i tre parametri come prima sono: richiesta, risposta e
                            //next (descritto dopo).
//    console.log('In the middleware');
//    next(); //Ci permette di passare al prossimo middlware presente nel codice
//});
app.use('/',(req,res,next)=>{
    console.log("Questo viene sempre eseguito!");
    next(); //per passare al prossimo middleware
});

app.use('/add-product',(req, res, next)=>{ //La richiesta per questo path, viene gestita
                                           //solo da questo, perchè la priorità è dal 
                                           //basso verso l'alto. (a meno che non si usi next() [Non
                                           //si deve fare dopo aver già fatto send]).
    console.log('In the middleware');
    res.send('<h1>Add product</h1>');
});

app.use('/',(req, res, next)=>{ //Questo è il secondo middleware
    console.log('In the middleware');
    res.send('<h1>Hello from express</h1>'); //possiamo comunque utilizzare setHeader(), ma la funzione
                                             //send(), è in grado di impostarlo da solo, e dinamicamente
                                             //riconoscendo il tipo mandato in risposta.
});

//const server = http.createServer(app); //A questo punto possiamo utilizzare il nostro oggetto creato
                                       //prima tramite express.
                                          
//server.listen(3000); //Attiva la modalità listen sul server.
//Questo vuol dire che il server continuerà ad
//ascoltare richieste sulla porta 3000
//dell'indirizzo passato (in questo caso si usa
//il default, ovvero localhost).

app.listen(3000); //Effettua sia la creazione del server, che la messa in 
              //listen di questo.
