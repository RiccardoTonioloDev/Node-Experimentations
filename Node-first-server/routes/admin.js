const express = require('express');
const path = require("path");

const router = express.Router();

//const rootDir = require("../util/path");
const productsController = require("../controllers/products");



// admin/add-product (GET)
router.get('/add-product',productsController.getAddProduct); //va solo messa la reference
                                                             //non le ()

    // admin/product (POST)
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
//In questo modo possiamo esportare più elementi facendo riferimento allo stesso file.
