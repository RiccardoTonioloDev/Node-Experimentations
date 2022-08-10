const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

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
	next();
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
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
