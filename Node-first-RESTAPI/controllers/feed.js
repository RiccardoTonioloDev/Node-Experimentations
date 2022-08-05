const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
	//Stiamo usando dei parametri di tipo query, non parametri normali.
	const currentPage = req.query.page || 1;
	const perPage = 2;
	let totalItems;

	Post.find()
		.countDocuments()
		.then((count) => {
			totalItems = count;
			return Post.find()
				.skip((currentPage - 1) * perPage)
				.limit(perPage);
		})
		.then((posts) => {
			//È importante esplicitare sempre il codice di stato
			res.status(200).json({
				message: 'Fetched posts succesfully.',
				posts: posts,
				totalItems: totalItems,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);

	//Qui basterà lanciare l'errore poichè non siamo in asincrono
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		throw error;
	}
	//Controllo la presenza di un file.
	if (!req.file) {
		const error = new Error('No image provided.');
		error.statusCode = 422;
		throw error;
	}

	const imageUrl = req.file.path;
	const title = req.body.title;
	const content = req.body.content;

	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
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
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			//Qui per inoltrare l'errore dobbiamo usare next, poichè siamo in asincrono
			next(err);
		});
};

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post.');
				error.statusCode = 404;
				//Qui posso lanciare l'errore anche se siamo in asincrona, poichè sarà il catch
				//a gestirlo.
				throw error;
			}
			res.status(200).json({ message: 'Post fetched.', post: post });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		throw error;
	}

	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image; //È settata se si vuole continuare a utilizzare l'immagine di prima

	if (req.file) {
		imageUrl = req.file.path;
	}
	if (!imageUrl) {
		const error = new Error('No file picked.');
		error.statusCode = 422;
		throw error;
	}

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post.');
				error.statusCode = 404;
				throw error;
			}

			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}

			post.title = title;
			post.imageUrl = imageUrl;
			post.content = content;

			return post.save();
		})
		.then((result) => {
			res.status(200).json({ message: 'Post updated!', post: result });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deletePost = (req, res, next) => {
	const postId = req.params.postId;

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post.');
				error.statusCode = 404;
				throw error;
			}
			//Check logged user

			clearImage(post.imageUrl);
			return Post.findByIdAndRemove(postId);
		})
		.then((result) => {
			console.log(result);
			res.status(200).json({ message: 'Post deleted.' });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

//Funzione utilitaria per andare a eliminare un'immagine nel server.
//USO: updatePost, deletePost
const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => console.log(err));
};
