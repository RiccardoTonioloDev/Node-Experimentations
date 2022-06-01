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
    console.log("REQ USER ID: " + req.user.id);
    // const newProduct = Product.build({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     userId: req.user.id,
    // });
    // console.log(newProduct);
    // newProduct
    //     .save()
    //     .then((result) => {
    //         console.log("Created product.");
    //         res.redirect("/admin/products");
    //     })
    //     .catch((err) => {
    //         console.log("Adding product error: ", err);
    //     }); METODO PER REALIZZARLO IN MANIERA DIFFERITA (PRIMA SI CREA, E POI SI SALVA SUL DATABASE).
    req.user
        //  questo metodo viene automaticamente creato, quando nel main noi andiamo a creare la relazione 1
        // a molti all'interno del main. In tal modo l'id dello user è già inserito.
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })
        // Product.create({
        //     title: title,
        //     price: price,
        //     imageUrl: imageUrl,
        //     description: description,
        //     userId: req.user.id,
        // })
        .then((result) => {
            console.log("Created product.");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log("Adding product error: ", err);
        });

    // const product = new Product(null, title, imageUrl, description, price); //serve il null poichè è la prima volta che costruiamo l'oggetto se
    // //lo stiamo creando tramite questa funzione.
    // product
    //     .save()
    //     .then(() => {
    //         res.redirect("/");
    //     })
    //     .catch((err) => {
    //         console.log("Errore add prodcut: ", err);
    //     }); Ora lo facciamo in sequelize, quindi queste istruzioni non servono più
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
            //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
            //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
        })
        .catch((err) => {
            console.log("Admin getProducts error: ", err);
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
    Product.findByPk(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => {
            console.log("getEditProduct admin error: ", err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    // const updatedProduct = new Product(id, title, imageUrl, description, price); //serve il null poichè è la prima volta che costruiamo l'oggetto se
    //lo stiamo creando tramite questa funzione.

    Product.findByPk(id)
        .then((product) => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save(); //In questo modo andiamo a salvare le modifiche all'interno del database.
            //Utilizza la chiave primaria (in questo caso id), e nel caso il prodotto non esistessa,
            //allora semplicemente creerebbe un nuovo recod.
            //FACCIO IL RETURN DI PRODUCT.SAVE solo perchè così non faccio troppo nesting di promesse, andando
            //a gestire le eventuali promesse al di sotto del then. Cioè la promessa di un then, diventa l'input
            //del prossimo then.
        })
        .then((result) => {
            console.log("Updated product!");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log("PostEditProduct error admin: ", err); // Questo catcher, prenderà gli errori eventuali, da entrambi i then.
        });

    // updatedProduct.save();
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    // Product.deleteById(id); ora utilizzo sequelize
    Product.findByPk(id)
        .then((product) => {
            product.destroy(); //Se invoco questo metodo sul prodotto, vado a inviare una query per eliminarlo
            //Altrimenti posso farlo direttamente sul modello Product, utilizzando all'interno delle parentesi,
            //un oggetto con specifica where.
        })
        .then((result) => {
            console.log("Destroyed product!");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log("Errore deleting product: ", err);
        });
};
