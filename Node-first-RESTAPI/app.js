const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

//Non useremo .urlencoded() poichè riceviamo JSON (è cambiato il content type delle richieste)
app.use(bodyParser.json());

//Ora ogni risposta che manderemo avrà questi headers, e di conseguenza
//non genererà più errori di tipo CORS.
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	//Per specificare da che dominio possiamo ricevere delle richieste.
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH'
	);
	//Per specificare che tipo di richieste possiamo ricevere.
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	//Per specificare che tipi di headers possono essere settati nella richiesta.
	next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
