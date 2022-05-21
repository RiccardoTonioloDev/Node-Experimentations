const Product = require("../models/products");
const Cart = require("../models/cart");

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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; //Prendiamo ciò che abbiamo identificato come productId
    //nel nostro URL, (che abbiamo quindi identificato essere un parametro della richiesta), e lo
    //passiamo in una apposita variabile.
    Product.findById(prodId, (prod) => {
        res.render("shop/product-detail", {
            product: prod,
            pageTitle: prod.title,
            path: "/products",
        });
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

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(product.id, product.price);
    });
    res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    });
};
