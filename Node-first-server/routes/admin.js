const express = require('express');
const path = require('path');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

//const rootDir = require("../util/path");
const adminController = require('../controllers/admin');

// admin/add-product (GET)
router.get('/add-product', isAuth, adminController.getAddProduct); //va solo messa la reference
// //non le ()

// // admin/product (POST)
router.post('/add-product', isAuth, adminController.postAddProduct);
// // admin/products (GET)
router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
// // In questo caso :productId serve per fare diventare il numero al posto di productId un parametro, reperibile tramite req.params.productId.

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
//In questo modo possiamo esportare più elementi facendo riferimento allo stesso file.
