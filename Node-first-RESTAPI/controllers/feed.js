const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
	try {
		//Stiamo usando dei parametri di tipo query, non parametri normali.
		const currentPage = req.query.page || 1;
		const perPage = 2;
		let totalItems;

		const count = await Post.find().countDocuments();
		totalItems = count;
		const posts = await Post.find()
			.populate('creator')
			.sort({ createdAt: -1 })
			//Fa il sort su createdAt in modalitò decrescente
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

		res.status(200).json({
			message: 'Fetched posts succesfully.',
			posts: posts,
			totalItems: totalItems,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.createPost = async (req, res, next) => {
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
	let creator;

	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	});
	try {
		let result = await post.save();
		const user = await User.findById(req.userId);
		creator = user;
		//Possiamo passare anche solo il post. Sarà poi mongoDB a capire qual'è l'id corretto.
		user.posts.push(post);
		result = await user.save();
		//201 come status code è specifico nel dire che una risorsa è stata creata con successo.

		io.getIO().emit('posts', { action: 'create', post: post });
		//emit serve per mandare a tutti gli utenti con una connessione attiva, un messaggio
		//tramite websocket.
		res.status(201).json({
			message: 'Post created succesfully!',
			post: post,
			creator: { _id: creator._id, name: creator.name },
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		//Qui per inoltrare l'errore dobbiamo usare next, poichè siamo in asincrono
		next(err);
	}
};

exports.getPost = async (req, res, next) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);

		if (!post) {
			const error = new Error('Could not find post.');
			error.statusCode = 404;
			//Qui posso lanciare l'errore anche se siamo in asincrona, poichè sarà il catch
			//a gestirlo.
			throw error;
		}
		res.status(200).json({ message: 'Post fetched.', post: post });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.updatePost = async (req, res, next) => {
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
	try {
		const post = await Post.findById(postId).populate('creator');

		if (!post) {
			const error = new Error('Could not find post.');
			error.statusCode = 404;
			throw error;
		}

		if (post.creator._id.toString() !== req.userId) {
			const error = new Error('Not authorized action.');
			error.statusCode = 403;
			throw error;
		}

		if (imageUrl !== post.imageUrl) {
			clearImage(post.imageUrl);
		}

		post.title = title;
		post.imageUrl = imageUrl;
		post.content = content;

		const result = await post.save();

		io.getIO().emit('posts', {
			action: 'update',
			post: result,
		});

		res.status(200).json({
			message: 'Post updated!',
			post: result,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.postId;
	let result;

	try {
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error('Could not find post.');
			error.statusCode = 404;
			throw error;
		}

		//Check logged user
		if (post.creator.toString() !== req.userId) {
			const error = new Error('Not authorized action.');
			error.statusCode = 403;
			throw error;
		}

		clearImage(post.imageUrl);
		result = await Post.findByIdAndRemove(postId);
		const user = await User.findById(req.userId);
		user.posts.pull(postId);
		result = await user.save();
		console.log(result);

		io.getIO().emit('posts', { action: 'delete', post: postId });

		res.status(200).json({ message: 'Post deleted.' });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

//Funzione utilitaria per andare a eliminare un'immagine nel server.
//USO: updatePost, deletePost
const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => console.log(err));
};
