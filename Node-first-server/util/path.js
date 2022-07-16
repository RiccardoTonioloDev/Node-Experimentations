const path = require('path');

module.exports = path.dirname(require.main.filename); //Questo ci serve a richiedere (require)
//del processo app.js (main)(quello
//che ha fatto partire il server), il nome
//del file che sta correntemente usando la
//funzione con la distanza appunto dal main.
//Con distanza intendo eventuali "..".
//Quel nome nella funzione dirname restituisce
//l'interno path, aggiungendo il nome.
