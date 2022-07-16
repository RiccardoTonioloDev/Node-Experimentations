const path = require('path');
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// // router.get("/checkout", shopController.getCheckout);
router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders);
router.get('/products/:productId', shopController.getProduct); //È importante che ci siano i ":", poichè segnalano
// // //a Express.js che quanto segue è un parametro variabile, passato tramite URL.

module.exports = router;
