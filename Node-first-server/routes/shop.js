const path = require("path");
const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);
router.get("/products/:productId", shopController.getProduct); //È importante che ci siano i ":", poichè segnalano
//a Express.js che quanto segue è un parametro variabile, passato tramite URL.

module.exports = router;
