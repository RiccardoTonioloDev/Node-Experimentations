const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

//      GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//      GET /feed/post/:postId
router.get('/post/:postId', isAuth, feedController.getPost);

//      POST /feed/post
router.post(
	'/post',
	isAuth,
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

//Il metodo PUT, può utilizzare il corpo.
//     PUT /feed/post/:postId
router.put(
	'/post/:postId',
	isAuth,
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.updatePost
);

//Il metodo DELETE, non può avere un corpo, quindi si usa l'URL.
//      DELETE /feed/post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
