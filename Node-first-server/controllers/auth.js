const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		//User.findById('62ceddab0afbe1c5aa424966')
		.then((user) => {
			if (!user) {
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save((err) => {
							if (err) {
								console.log(
									'Error while saving session to db: ',
									err
								);
							}
							res.redirect('/');
						});
					}
					res.redirect('/login');
				})
				.catch((err) => {
					//Non si entra qui se le password non sono uguali, ma solo quando si verifica
					//un errore.
					if (err) {
						console.log('Error while comparing passwords: ', err);
					}
					res.redirect('/login');
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

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				return res.redirect('/signup'); //L'utente esiste già, quidi lo rimandiamo direttamente alla pagina di signup
			}
			return bcrypt
				.hash(password, 12) //Effettua l'hashing della stringa password ben 12 volte
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { item: [] },
					});
					return user.save();
				})
				.then((result) => {
					res.redirect('/login');
				}); //Ho continuato la sequenza qui, per evitare che anche se l'utente esistesse già, si provasse a creare
			//un nuovo utente.
		})
		.catch((err) => {
			console.log('Error while signup: ', err);
		});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'signup',
		isAuthenticated: false,
	});
};
