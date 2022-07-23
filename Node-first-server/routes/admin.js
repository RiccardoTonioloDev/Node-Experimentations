const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

//const rootDir = require("../util/path");
const adminController = require('../controllers/admin');

// admin/add-product (GET)
router.get('/add-product', isAuth, adminController.getAddProduct); //va solo messa la reference
// //non le ()

// // admin/product (POST)
router.post(
	'/add-product',
	[
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postAddProduct
);
// // admin/products (GET)
router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
// // In questo caso :productId serve per fare diventare il numero al posto di productId un parametro, reperibile tramite req.params.productId.

router.post(
	'/edit-product',
	[
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('description').isLength({ min: 5, max: 400 }).trim(),
	],
	isAuth,
	adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
//In questo modo possiamo esportare più elementi facendo riferimento allo stesso file.
