const mongoose = require('mongoose');
const expect = require('chai').expect;
const sinon = require('sinon');
require('dotenv').config();

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function () {
	//Viene avviato prima di tutti i test.
	//Esiste anche un beforeEach che viene eseguito prima di ogni test.
	before(function (done) {
		mongoose
			.connect(
				`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.wpbzy.mongodb.net/test-messages?retryWrites=true&w=majority`
			)
			.then((result) => {
				const user = new User({
					name: 'test',
					email: 'test@test.com',
					password: 'test',
					posts: [],
					_id: '62f3c9f642f4e8542284afc5',
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

	it('should throw an error with code 500 if accessing the database fails', function (done) {
		sinon.stub(User, 'findOne');
		User.findOne.throws(); //facciamo si che quando findOne viene chiamato,
		//viene automaticamente lanciato un errore.
		const req = {
			body: {
				email: 'test@test.com',
				password: 'test',
			},
		};
		AuthController.login(req, {}, () => {}).then((result) => {
			expect(result).to.be.an('error');
			expect(result).to.have.property('statusCode', 500);
			User.findOne.restore();
			done(); //Per aspettare che anche il codice asyncrono finisca
			//di essere eseguito.
		});
	});

	it('should send a response with a valid user status, for an existing user', function (done) {
		const req = { userId: '62f3c9f642f4e8542284afc5' };
		const res = {
			statusCode: 500,
			userStatus: null,
			status: function (code) {
				this.statusCode = code;
				return this;
			},
			json: function (data) {
				this.userStatus = data.status;
			},
		};
		AuthController.getStatus(req, res, () => {}).then(() => {
			expect(res.statusCode).to.be.equal(200);
			expect(res.userStatus).to.be.equal('I am new!');
			done();
		});
	});

	//Viene avviato alla fine di tutti i test.
	//Esiste anche un afterEach che viene eseguito dopo ogni test.
	after(function (done) {
		User.deleteMany({})
			.then((result) => {
				//Dobbiamo disconnetterci, sennò mocha vede che c'è qualcosa
				//che è ancora in esecuzione nell'event loop, e quindi non
				//termina.
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});
