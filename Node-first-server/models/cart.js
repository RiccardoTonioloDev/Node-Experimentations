const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex((p) => p.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            //Aggiungendo il + davanti a productPrice, effettuo il casting della variabile in numero.
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log("Verifica errori cart: ", err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            console.log("Errore cancellazione dal carrello: ", err);
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find((p) => p.id === id);
            if (!product) {
                return; //Non devo continuare se non ho il prodotto in questione nel carrello.
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter((p) => p.id != id);
            updatedCart.totalPrice = updatedCart.totalPrice - productQty * productPrice;
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log("Verifica errori cart (delete): ", err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};
