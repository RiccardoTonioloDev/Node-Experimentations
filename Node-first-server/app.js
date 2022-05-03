const http = require("http"); //Modo per importare file in Node
const routes = require("./routes"); //C'è il './' appunto perchè routes
//non è un file disponibile a livello
//globale.

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
const server = http.createServer(routes); //Se arriva una richiesta, viene usata la funzione
                                          //creata in routes. I parametri req e res vengono
                                          //direttamente passati alla funzione.
                                          //Infatti nell'altro file abbiamo esportato la
                                          //funzione, che richiede quei due parametri.
                                          //Allo stesso modo, li è implicita la richiesta
                                          //di parametri

server.listen(3000); //Attiva la modalità listen sul server.
//Questo vuol dire che il server continuerà ad
//ascoltare richieste sulla porta 3000
//dell'indirizzo passato (in questo caso si usa
//il default, ovvero localhost).
