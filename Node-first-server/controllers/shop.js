const Product = require("../models/products");

exports.getProducts = (req, res, next) => {
    //Questo è il secondo middleware
    //console.log("shop.js",adminData.products)
    //res.sendFile(path.join(rootDir, "views","shop.html")); //possiamo comunque utilizzare setHeader(), ma la funzione
    //send(), è in grado di impostarlo da solo, e dinamicamente
    //riconoscendo il tipo mandato in risposta.
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "My Shop",
            path: "/products",
        }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
        //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "My Shop",
            path: "/",
        }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
        //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
    });
};

exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
    });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
