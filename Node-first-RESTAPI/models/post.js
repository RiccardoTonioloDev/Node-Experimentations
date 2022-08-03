const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		creator: {
			type: Object,
			required: String,
		},
	},
	{ timestamps: true }
	//Per aggiungere in automatico il createdAt (anche se magari avrà un'altro nome)
);

module.exports = mongoose.model('Post', postSchema);
