const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SECRET_JWT);
	} catch (err) {
		//Errore del server
		//QUESTO SPAZIO NON SI ATTIVA SE IL TOKEN NON È STATO VERIFICATO
		req.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	//Se sono arrivato fin qui, vuol dire che siamo autenticati.
	req.userId = decodedToken.userId;
	req.isAuth = true;
	next();
};
