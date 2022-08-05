const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: 'I am new!',
	},
	//Specifichiamo un array di post: in realtà sono delle reference agli id
	//dei post originali.
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
});

module.exports = mongoose.model('User', userSchema);
