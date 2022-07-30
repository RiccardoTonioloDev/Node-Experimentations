const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct); //È importante che ci siano i ":", poichè segnalano
// // //a Express.js che quanto segue è un parametro variabile, passato tramite URL.

//routes da proteggere
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// // router.get("/checkout", shopController.getCheckout);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);
module.exports = router;
