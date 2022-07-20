//Crypto ci permette di creare variabili randomiche e sicure (oltre a possedere protocolli crittografici)
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');
require('dotenv').config(); //Per ripulire gli output dal file .env

//Sostanzialmente nodemailer ci permette di creare un transporter (ovvero un processo,
//che ci permette di inviare mail, tramite un servizio terzo). Al createTransport, passiamo
//il sendgridTransport come funzione, poichè crea la configuirazione per il transport, di modo
//da interfacciarsi con SendGrid in modo corretto. Ad esso dobbiamo passare la API key di
//autenticazione.
const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: process.env.API_KEY_SENDGRID,
		},
	})
);

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		//Possiamo prelevare la frase di errore scelta, in questo modo:
		errorMessage: message,
		//Una volta usato questo metodo, il valore associato ad error, verrà rimosso.
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		//User.findById('62ceddab0afbe1c5aa424966')
		.then((user) => {
			if (!user) {
				//In questo modo salviamo nel valore chiave error, la frase scelta.
				req.flash('error', 'Invalid email or password.');
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
					req.flash('error', 'Invalid email or password.');
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
				req.flash(
					'error',
					'Email exists already, please pick a different one.'
				);
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
					return transporter.sendMail({
						to: email,
						from: process.env.SENDGRID_VERIFIED_SENDER,
						subject: 'Signup succeded!',
						html: '<h1>You successfully signed up!</h1>',
					});
				})
				.catch((err) => {
					console.log('Error while sending email/signUpping: ', err);
				}); //Ho continuato la sequenza qui, per evitare che anche se l'utente esistesse già, si provasse a creare
			//un nuovo utente.
		})
		.catch((err) => {
			console.log('Error while signup: ', err);
		});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'signup',
		errorMessage: message,
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	const email = req.body.email;
	//.randomBytes genera in questo caso, 32 bytes randomici. Se fallisce fornisce un errore,
	//altrimenti restituisce un buffer.
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log('Error while posting reset (crypto): ', err);
			return res.redirect('/reset');
		}
		//Usando il toString in questo modo diciamo che dobbiamo trasformare
		//da valore esadecimale a ASCII normale.
		const token = buffer.toString('hex');
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account with that email found.');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000; //Questa è un'ora in millisecondi
				return user.save();
			})
			.then((result) => {
				res.redirect('/');
				return transporter.sendMail({
					to: email,
					from: process.env.SENDGRID_VERIFIED_SENDER,
					subject: 'Password Reset',
					html: `
					<p>You requested a password reset</p>
					<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
					`,
				});
			})
			.catch((err) => {
				console.log('Error while adding token to user: ', err);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
	})
		.then((user) => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New Password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			console.log('Error while getting form for new password: ', err);
		});
};

exports.postNewPassword = (req, res, next) => {
	const newPasword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(newPasword, 12);
		})
		.then((hashedPassword) => {
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			resetUser.password = hashedPassword;

			return resetUser.save();
		})
		.then((result) => {
			res.redirect('/login');
		})
		.catch((err) => {
			console.log('Error while setting the new password: ', err);
		});
};
