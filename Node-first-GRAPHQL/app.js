const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const { clearImage } = require('./util/file');

const auth = require('./middleware/auth');

require('dotenv').config();

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

//Non useremo .urlencoded() poichè riceviamo JSON (è cambiato il content type delle richieste)
app.use(bodyParser.json());

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

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

	//Questo ci serve poichè altrimenti graphql andrà a rifiutare qualsiasi richiesta
	//con un metodo diverso da GET o POST.
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}

	next();
});

//Questo middleware scorrerà qualsiasi richiesta, e al massimo se un utente non
//è autenticato, verrà specificato all'interno della richiesta.
app.use(auth);

app.put('/post-image', (req, res, next) => {
	if (!req.isAuth) {
		throw new Error('Not authenticated.');
	}
	//Per verifica di una richiesta di aggiunta immagine.
	if (!req.file) {
		return res.status(200).json({ message: 'No file provided!' });
	}
	//Per rimozione dell'immagine
	if (req.body.oldPath) {
		clearImage(req.body.oldPath);
	}
	return res
		.status(201)
		.json({ message: 'File stored.', filePath: req.file.path });
});

app.use(
	'/graphql',
	graphqlHTTP({
		//Questo assegna lo schema precedentemente creato
		schema: graphqlSchema,
		//Questo assegna i resolver
		rootValue: graphqlResolver,
		//Questo serve per attivare il tester delle varie query
		graphiql: true,
		customFormatErrorFn(err) {
			if (!err.originalError) {
				//In questo caso è solo un errore tecnico (i.e. query scritta male)
				return err;
			}
			const data = err.originalError.data || 'Technical error.';
			const code = err.code || 500;
			const message = err.originalError.message || 'An error occurred.';

			return {
				data: data,
				code: code,
				message: message,
			};
		},
	})
);

//ERROR HANDLING
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;

	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(
		`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.wpbzy.mongodb.net/messages?retryWrites=true&w=majority`
	)
	.then((res) => {
		app.listen(8080);
	})
	.catch((err) => console.log(err));
