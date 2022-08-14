const expect = require('chai').expect;
const authMiddleware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

//Describe ci permette di raggruppare tutti i test, sotto un'unica intestazione
//di modo che leggere la console risulti più chiaro.
describe('auth middleware', function () {
	it('should throw an error if no authorization header is present', function () {
		const req = {
			get: function () {
				return null;
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			'Not authenticated'
		);
	});

	it('should throw an error if the authorization header is only one string', function () {
		const req = {
			get: function () {
				return 'xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('should throw an error if the token cannot be verified', function () {
		const req = {
			get: function () {
				return 'xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('should yield a userId after deconding the token', function () {
		const req = {
			get: function () {
				return 'Bearer adfjalfjalfjalfjaljfald';
			},
		};
		//Sovrascriviamo (SOLO NEI TEST), il metodo verify, per generare sempre
		//un risultato che non lancia errori (poichè stiamo utlizzando un token
		//non valido in realtà), di modo da vedere se viene aggiunta la proprietà
		//userId alla richiesta.
		sinon.stub(jwt, 'verify'); //Qui stub va a rimpiazzare il metodo verify
		jwt.verify.returns({ userId: 'abc' }); //Qui definiamo cosa deve dare in return
		authMiddleware(req, {}, () => {});
		expect(req).to.have.property('userId');
		expect(req).to.have.property('userId', 'abc');
		expect(jwt.verify.called).to.be.true;
		jwt.verify.restore(); //Qui ristabiliamo quel metodo a cosa valeva prima.
	});
});
