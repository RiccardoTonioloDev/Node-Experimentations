const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//Si crea la logica per gestire le varie query in entrata
module.exports = {
	createUser: async function ({ userInput }, req) {
		//args è un oggetto che contiene tutti gli oggetti che passiamo all'interno della funzione

		//Validazione dell'input
		const errors = [];
		if (!validator.isEmail(userInput.email)) {
			errors.push('Email is invalid.');
		}
		if (
			validator.isEmpty(userInput.password) ||
			!validator.isLength(userInput.password, { min: 5 })
		) {
			errors.push('Password is invalid.');
		}
		if (errors.length > 0) {
			const error = new Error('Invalid input.');
			error.data = errors;
			error.code = 422;
			throw error;
		}

		const existingUser = await User.findOne({ email: userInput.email });
		if (existingUser) {
			const error = new Error('User exists already.');
			throw error;
		}

		const hashedPw = await bcrypt.hash(userInput.password, 12);
		const user = new User({
			email: userInput.email,
			password: hashedPw,
			name: userInput.name,
		});
		const createdUser = await user.save();
		return {
			...createdUser._doc,
			_id: createdUser._id.toString(),
		};
	},
};
