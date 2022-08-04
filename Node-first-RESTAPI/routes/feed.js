const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');
const router = express.Router();

//      GET /feed/posts
router.get('/posts', feedController.getPosts);

//      GET /post/:postId
router.get('/post/:postId', feedController.getPost);

//      POST /feed/post
router.post(
	'/post',
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

//Il metodo PUT, può utilizzare il corpo.
//     PUT /post/:postId
router.put(
	'/post/:postId',
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.updatePost
);

//Il metodo DELETE, non può avere un corpo, quindi si usa l'URL.
//     DELETE /post/:postId
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
