const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/feed');
require('dotenv').config();

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	let result;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({
			email: email,
			name: name,
			password: hashedPassword,
		});
		result = await user.save();
		res.status(201).json({
			message: 'User created!',
			userId: result._id,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('User with this email not found.');
			error.statusCode = 404;
			throw error;
		}
		loadedUser = user;
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error('Wrong password.');
			error.statusCode = 422;
			throw error;
		}
		//Se siamo arrivati fin qui, l'utente esiste ed è autenticato
		const token = jwt.sign(
			//Specifichiamo i dati che saranno contenuti nel token.
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
			},
			//Specifichiamo il segreto con cui firmeremo il token.
			process.env.SECRET_JWT,
			//Specifichiamo altre opzioni (in questo caso quanto vale il token a livello di tempo)
			{
				expiresIn: '1h',
			}
		);

		res.status(200).json({
			token: token,
			userId: loadedUser._id.toString(),
		});
		return;
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
		return err;
	}
};

exports.getStatus = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error(`User doesn't exist.`);
			error.statusCode = 404;
			throw error;
		}
		const status = user.status;
		res.status(200).json({
			message: 'Status fetched correctly.',
			status: status,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.updateStatus = async (req, res, next) => {
	const newStatus = req.body.status;
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error(`User doesn't exist.`);
			error.statusCode = 404;
			throw error;
		}
		user.status = newStatus;
		const result = await user.save();
		res.status(200).json({
			status: newStatus,
			message: 'Status updated succesfully.',
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
