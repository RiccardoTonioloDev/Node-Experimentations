const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

//      PUT /auth/signup
router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.normalizeEmail()
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDocument) => {
					if (userDocument) {
						return Promise.reject('E-mail address already exists.');
					}
				});
			}),
		body('password').trim().isLength({ min: 5 }),
		body('name').trim().not().isEmpty(),
	],
	authController.signup
);

//      POST /auth/login
router.post('/login', authController.login);

//      GET /auth/status
router.get('/status', isAuth, authController.getStatus);

//      PUT /auth/status
router.put(
	'/status',
	isAuth,
	[body('status').trim().isString().not().isEmpty()],
	authController.updateStatus
);

module.exports = router;
