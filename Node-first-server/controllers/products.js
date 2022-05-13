const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
    //La richiesta per questo path, viene gestita
    //solo da questo, perchè la priorità è dal
    //basso verso l'alto. (a meno che non si usi next() [Non
    //si deve fare dopo aver già fatto send]).
    //res.sendFile(path.join(rootDir, "views","add-product.html"));
    res.render("add-product", {
        pageTitle: "Add product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
}; //abbiamo aggiunto nel form /admin/ prima di product, questo perchè fuori, nell'app, è
//dichiarato che tutte le routes in questa page appartengono alla path admin.

exports.postAddProduct = (req, res, next) => {
    //Verrà utilizzato solo per richieste entranti in post.
    //Esiste anche app.get per fare la stessa cosa ma con il get.
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    //Questo è il secondo middleware
    //console.log("shop.js",adminData.products)
    //res.sendFile(path.join(rootDir, "views","shop.html")); //possiamo comunque utilizzare setHeader(), ma la funzione
    //send(), è in grado di impostarlo da solo, e dinamicamente
    //riconoscendo il tipo mandato in risposta.
    const products = Product.fetchAll((products) => {
        res.render("shop", {
            prods: products,
            pageTitle: "My Shop",
            path: "/",
            hasProducts: products.length > 0,
            productCSS: true,
            activeShop: true,
        }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
        //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
    });
};
