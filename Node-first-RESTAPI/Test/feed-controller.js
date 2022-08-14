require('dotenv').config();
const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');
const io = require('../socket');
const Post = require('../models/post');

describe('Feed Controller', function () {
	before(function (done) {
		mongoose
			.connect(
				`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.wpbzy.mongodb.net/test-messages?retryWrites=true&w=majority`
			)
			.then((result) => {
				const user = new User({
					email: 'test@test.com',
					password: 'tester',
					name: 'Test',
					posts: [],
					_id: '5c0f66b979af55031b34728b',
				});
				return user.save();
			})
			.then((result) => {
				done();
			})
			.catch((err) => {
				console.log(err);
			});
	});

	beforeEach(function () {});

	afterEach(function () {});

	it('should add a created post to the posts of the creator', function (done) {
		const req = {
			body: {
				title: 'Test Post',
				content: 'A Test Post',
			},
			file: {
				path: 'abc',
			},
			userId: '5c0f66b979af55031b34728b',
		};
		const res = {
			status: function () {
				return this;
			},
			json: function () {},
		};

		sinon.stub(io, 'getIO');
		io.getIO.returns({ emit: function () {} });

		FeedController.createPost(req, res, () => {})
			.then((savedUser) => {
				expect(savedUser).to.have.property('posts');
				expect(savedUser.posts).to.have.length(1);
				io.getIO.restore();
				done();
			})
			.catch((err) => {
				console.log(err);
			});
	});

	after(function (done) {
		User.deleteMany({})
			.then((result) => {
				return Post.deleteMany({});
			})
			.then((result) => {
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});
});
