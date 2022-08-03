const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
	//È importante esplicitare sempre il codice di stato
	res.status(200).json({
		posts: [
			{
				_id: '1',
				title: 'Primo post',
				content: 'Questo è il primo post!',
				imageUrl: 'images/duck.jpg',
				creator: {
					name: 'Riccardo',
				},
				createdAt: new Date(),
			},
		],
	});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(422)
			.json({ message: 'Validation failed.', errors: errors.array() });
	}

	const title = req.body.title;
	const content = req.body.content;

	const post = new Post({
		title: title,
		content: content,
		imageUrl: 'images/libro.jpg',
		creator: {
			name: 'Riccardo',
		},
	});
	post.save()
		.then((result) => {
			console.log(result);
			//201 come status code è specifico nel dire che una risorsa è stata creata con successo.
			res.status(201).json({
				message: 'Post created succesfully!',
				post: result,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
