const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
    constructor(title, price, description, imageUrl, _id, userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this._id = _id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            //Se l'id è già settato, si fa l'update del prodotto
            dbOp = db.collection("products").updateOne({ _id: this._id }, { $set: this });
            //l'id non viene sovrascritto, vengono sovrascritti solo gli altri campi.
        } else {
            dbOp = db.collection("products").insertOne(this);
        }
        return dbOp
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log("Error in saving a product: ", err);
            });
    }
    static fetchAll() {
        const db = getDb();
        return db
            .collection("products")
            .find()
            .toArray()
            .then((products) => {
                return products;
            })
            .catch((err) => {
                //usare il find ci permette di non reperire tutti i documenti subito, ma di
                //avere un tramite per richiederli uno alla volta. Tipo il current file pointer in C.
                console.log("Error fatching all products", err);
            });
    }

    static findById(prodId) {
        const db = getDb();
        return (
            db
                .collection("products")
                .find({ _id: new mongodb.ObjectId(prodId) })
                .next() //Next mi permette di prelevare il documento selezionato dal find precedentemente fatto
                //poichè il find è solo un ""puntatore"" ai documenti.
                .then((product) => {
                    return product;
                })
                .catch((err) => {
                    console.log("Error fetching a product by id: ", err);
                })
        );
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection("products")
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then((result) => {
                console.log("Deleted");
            })
            .catch((err) => {
                console.log("Error during deletion: ", err);
            });
    }
}
// Commentato per utilizzare mongodb
// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
// });

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
