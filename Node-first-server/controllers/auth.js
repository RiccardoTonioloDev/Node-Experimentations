const { rawListeners } = require('../models/user');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('62ceddab0afbe1c5aa424966')
		.then((user) => {
			req.session.user = user;
			req.session.isLoggedIn = true;
			req.session.save((err) => {
				if (err) {
					console.log('Error while saving session to db: ', err);
				}
				res.redirect('/');
			});
		})
		.catch((err) => {
			console.log('Error while setting user in session: ', user);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		//Funzione che distrugge la sessione attuale
		if (err) {
			console.log('Error while destroying session: ', err);
		}
		res.redirect('/'); //Callback.
	});
};

exports.postSignup = (req, res, next) => {};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'signup',
		isAuthenticated: false,
	});
};
