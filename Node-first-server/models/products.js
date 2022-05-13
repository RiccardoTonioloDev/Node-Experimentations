const fs = require("fs");
const path = require("path");
const { callbackify } = require("util");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callBack) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callbBack([]); //dobbiamo fare il return qui per assicurarci
            //che la parte successiva non venga mai eseguita.
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this); //DOBBIAMO USARE UNA FUNZIONE A FRECCIA:
            //solo in questo modo facciamo ancora riferimento
            //a un oggetto della classe.
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callBack) {
        //usando static come keyword, io specifico che uso questo metodo
        //sulla classe stessa, e non su un oggetto specifico.
        getProductsFromFile(callBack);
    }
};
