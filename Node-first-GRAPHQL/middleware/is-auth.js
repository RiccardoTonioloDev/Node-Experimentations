const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SECRET_JWT);
	} catch (err) {
		//Errore del server
		//QUESTO SPAZIO NON SI ATTIVA SE IL TOKEN NON È STATO VERIFICATO
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error('Not authenticated.');
		error.statusCode = 401;
		throw error;
	}

	//Se sono arrivato fin qui, vuol dire che siamo autenticati.
	req.userId = decodedToken.userId;
	next();
};
