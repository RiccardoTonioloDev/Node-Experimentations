const express = require("express");
const path = require("path");

const router = express.Router();

//const rootDir = require("../util/path");
const adminController = require("../controllers/admin");

// admin/add-product (GET)
router.get("/add-product", adminController.getAddProduct); //va solo messa la reference
//non le ()

// admin/product (POST)
router.post("/add-product", adminController.postAddProduct);
// admin/products (GET)
router.get("/products", adminController.getProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

module.exports = router;
//In questo modo possiamo esportare più elementi facendo riferimento allo stesso file.
