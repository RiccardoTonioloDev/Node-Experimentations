const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    //Questo è il secondo middleware
    //console.log("shop.js",adminData.products)
    //res.sendFile(path.join(rootDir, "views","shop.html")); //possiamo comunque utilizzare setHeader(), ma la funzione
    //send(), è in grado di impostarlo da solo, e dinamicamente
    //riconoscendo il tipo mandato in risposta.
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render("shop/product-list", {
    //             prods: rows,
    //             pageTitle: "My Shop",
    //             path: "/products",
    //         }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
    //         //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
    //         //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
    //     })
    //     .catch((err) => {
    //         console.log("Errore fetching products: ", err);
    //     }); Inutile visto che ora usiamo direttamente sequelize
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Products",
                path: "/products",
            }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
            //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
            //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
        })
        .catch((err) => {
            console.log("Get index error: ", err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; //Prendiamo ciò che abbiamo identificato come productId
    //nel nostro URL, (che abbiamo quindi identificato essere un parametro della richiesta), e lo
    //passiamo in una apposita variabile.
    // Product.findById(prodId)
    //     .then(([product, fieldData]) => {
    //         res.render("shop/product-detail", {
    //             product: product[0],
    //             pageTitle: product[0].title,
    //             path: "/products",
    //         });
    //     })
    //     .catch((err) => {
    //         console.log("Errore getProduct: ", err);
    //     });
    Product.findByPk(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
            //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
            //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
        })
        .catch((err) => {
            console.log("Get index error: ", err);
        });
};

exports.getIndex = (req, res, next) => {
    // Product.fetchAll() Non usiamo più sql puro, quindi questa riga sarà sostituita in:
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "My Shop",
                path: "/",
            }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
            //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
            //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
        })
        .catch((err) => {
            console.log("Get index error: ", err);
        });
};

exports.getCart = (req, res, next) => {
    // Cart.getCart((cart) => {
    //     Product.fetchAll((products) => {
    //         const cartProducts = [];
    //         for (const product of products) {
    //             const cartProductData = cart.products.find((prod) => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    //         res.render("shop/cart", {
    //             path: "/cart",
    //             pageTitle: "Your Cart",
    //             products: cartProducts,
    //         });
    //     });
    // });
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((products) => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
            });
        })
        .catch((err) => {
            console.log("Error get cart: ", err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    // Product.findById(prodId, (product) => {
    //     Cart.addProduct(product.id, product.price);
    //     res.redirect("/cart");
    // });
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then((product) => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log("Post cart error: ", err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart");
    });
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
