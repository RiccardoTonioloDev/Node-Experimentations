const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
    //La richiesta per questo path, viene gestita
    //solo da questo, perchè la priorità è dal
    //basso verso l'alto. (a meno che non si usi next() [Non
    //si deve fare dopo aver già fatto send]).
    //res.sendFile(path.join(rootDir, "views","add-product.html"));
    res.render("admin/edit-product", {
        pageTitle: "Add product",
        path: "/admin/add-product",
        editing: false,
    });
}; //abbiamo aggiunto nel form /admin/ prima di product, questo perchè fuori, nell'app, è
//dichiarato che tutte le routes in questa page appartengono alla path admin.

exports.postAddProduct = (req, res, next) => {
    //Verrà utilizzato solo per richieste entranti in post.
    //Esiste anche app.get per fare la stessa cosa ma con il get.
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(null, title, imageUrl, description, price); //serve il null poichè è la prima volta che costruiamo l'oggetto se
    //lo stiamo creando tramite questa funzione.
    product.save();
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
        }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
        //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
    });
};

exports.getEditProduct = (req, res, next) => {
    //La richiesta per questo path, viene gestita
    //solo da questo, perchè la priorità è dal
    //basso verso l'alto. (a meno che non si usi next() [Non
    //si deve fare dopo aver già fatto send]).
    //res.sendFile(path.join(rootDir, "views","add-product.html"));
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId; //In questo modo si prende l'Id dall'URL
    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product,
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const updatedProduct = new Product(id, title, imageUrl, description, price); //serve il null poichè è la prima volta che costruiamo l'oggetto se
    //lo stiamo creando tramite questa funzione.
    updatedProduct.save();
    res.redirect("/admin/products");
};
