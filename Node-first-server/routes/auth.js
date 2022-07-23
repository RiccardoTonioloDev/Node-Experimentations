const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user');

const { check, body } = require('express-validator'); //Facciamo così poichè ci interessa solo la funzionalità di check.

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Insert a valid email.'),
		body(
			'password',
			'Insert a valid password (Alphanumeric & with more than 5 characters).'
		)
			.isAlphanumeric()
			.isLength({ min: 5 }),
	],
	authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
	'/signup',
	//Possiamo incapsulare a mo' di array, i nostri vari check (per rendere lo stile del codice più espressivo).
	[
		//Il check va a estrarre la parola email ovunque (cookie, headers, sessions, ...)
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom((value, { req }) => {
				//email è value in questo caso, poichè lo stiamo processando in questo modo.
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						//Questa è chiamata validazione asincrona. Express-validator infatti può
						//ricevere come valori da una custom: true, false, e dei risultati di una
						//promessa. In questo caso la rejection della promessa, viene presa come
						//error message.
						return Promise.reject(
							'Email exists already, please pick a different one.'
						);
					}
				});
			}),
		//Il body va a estrarre la parola password, solo all'interno del body.
		body(
			'password',
			'Please enter a password with only numbers and text and at least 5 characters.'
			//Il secondo parametro indica il messaggio da associare a qualsiasi errorMessage che
			//viene estratto dai vari validatori.
		)
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match');
			}
			return true;
			//In un validator custom BISOGNA SEMPRE METTERE IL TRUE se il campo è valido.
		}),
	],
	authController.postSignup
); //Aggiungiamo un middleware per effettuare una
//validazione automatica sulla mail.
//Il withMessage sostituisce il messaggio con una nostra frase.
//Si possono ovviamente aggiungere validatori custom (tramite la funzione .custom),
//che ci permettono di creare delle nostre validazioni, usando lo stesso framework.
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
