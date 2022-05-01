const fs = require('fs'); //Abbiamo richiesto la funzione per l'uso del
                          //filesystem, e l'abbiamo posizionata in una
                          //costante apposita.

fs.writeFileSync('hello.txt',"Hello from Node.js"); //Abbiamo poi usato
                         //usato la costante per utilizzare il
                         //filesystem, tramite la funzione writeFileSync
                         //per posizionare nella directory corrente, il
                         //file hello.txt, e posizionarvici all'interno
                         //il testo passato come secondo argomento.
//console.log('Hello from Node.js');
