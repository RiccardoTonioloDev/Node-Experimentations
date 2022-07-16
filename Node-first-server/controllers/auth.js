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
			res.redirect('/');
		})
		.catch((err) => {
			console.log('Error while setting user in session: ', user);
		});
};
