const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Product;

// // const fs = require("fs");
// // const path = require("path"); non mi servono più perchè non lavoro più con un file come database
// // const rootDir = require("../util/path");
// const Cart = require("./cart");
// const db = require("../util/database");

// // const p = path.join(rootDir, "data", "products.json");

// // non mi servono più perchè non lavoro più con un file come database
// // const getProductsFromFile = (callBack) => {
// //     fs.readFile(p, (err, fileContent) => {
// //         if (err) {
// //             callBack([]); //dobbiamo fare il return qui per assicurarci
// //             //che la parte successiva non venga mai eseguita.
// //         } else {
// //             callBack(JSON.parse(fileContent));
// //         }
// //     });
// // };

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         // getProductsFromFile((products) => {
//         //     if (this.id) {
//         //         const existingProductIndex = products.findIndex((p) => p.id === this.id);
//         //         const updatedProducts = [...products];
//         //         updatedProducts[existingProductIndex] = this; //si riferisce all'oggetto passato tramite il form, una volta costruito
//         //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         //             console.log("Errore durante l'updating del file prodotti: ", err);
//         //         });
//         //     } else {
//         //         this.id = Math.random().toString();
//         //         products.push(this); //DOBBIAMO USARE UNA FUNZIONE A FRECCIA:
//         //         //solo in questo modo facciamo ancora riferimento
//         //         //a un oggetto della classe.
//         //         fs.writeFile(p, JSON.stringify(products), (err) => {
//         //             console.log(err);
//         //         });
//         //     }
//         // });
//         return db.execute("INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)", [this.title, this.price, this.imageUrl, this.description]);
//     }

//     static deleteById(id) {
//         // getProductsFromFile((products) => {
//         //     const product = products.find((p) => p.id == id);
//         //     const updatedProducts = products.filter((p) => p.id != id);
//         //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         //         console.log("Errore al cancellamento:", err);
//         //         if (!err) {
//         //             Cart.deleteProduct(id, product.price);
//         //         }
//         //     });
//         // });
//     }

//     static fetchAll() {
//         //usando static come keyword, io specifico che uso questo metodo
//         //sulla classe stessa, e non su un oggetto specifico.
//         // getProductsFromFile(callBack);
//         return db.execute("SELECT * FROM products");
//         // In questo modo ritorniamo una promessa, rendendo così gestibile con il .then(), il risultato della funzione
//         // quando verrà richiamata.
//     }

//     static findById(id) {
//         // getProductsFromFile((products) => {
//         //     const product = products.find((p) => p.id == id);
//         //     cb(product);
//         // });
//         return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//     }
// };
//È tutto commentato  poichè d'ora in poi utilizzeremo sequelize.
