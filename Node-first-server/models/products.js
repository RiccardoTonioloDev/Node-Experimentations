const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callBack) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callBack([]); //dobbiamo fare il return qui per assicurarci
            //che la parte successiva non venga mai eseguita.
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex((p) => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this; //si riferisce all'oggetto passato tramite il form, una volta costruito
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log("Errore durante l'updating del file prodotti: ", err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this); //DOBBIAMO USARE UNA FUNZIONE A FRECCIA:
                //solo in questo modo facciamo ancora riferimento
                //a un oggetto della classe.
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(callBack) {
        //usando static come keyword, io specifico che uso questo metodo
        //sulla classe stessa, e non su un oggetto specifico.
        getProductsFromFile(callBack);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id == id);
            cb(product);
        });
    }
};
