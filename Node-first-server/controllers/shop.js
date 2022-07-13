const Product = require('../models/products');
const Order = require('../models/order');

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
	//Ora usiamo mongoDB
	// Product.findAll()
	//     .then((products) => {
	//         res.render("shop/product-list", {
	//             prods: products,
	//             pageTitle: "Products",
	//             path: "/products",
	//         }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
	//         //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
	//         //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
	//     })
	//     .catch((err) => {
	//         console.log("Get index error: ", err);
	//     });
	Product
		//.fetchAll() ora usiamo mongoose
		.find() //Il metodo find non restituisce un puntatore, bensì tutti gli elementi
		//Con grandi quantità di dati è meglio utilizzare il cursore, o magari limitare il
		//reperimento tramite find.
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Products',
				path: '/products',
			}); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
			//dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
			//Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
		})
		.catch((err) => {
			console.log('Get index error: ', err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId; //Prendiamo ciò che abbiamo identificato come productId
	//nel nostro URL, (che abbiamo quindi identificato essere un parametro della richiesta), e lo
	//passiamo in una apposita variabile.
	Product.findById(prodId) //Mongoose possiede di per se un find by id
		//E riesce anche a trasformare prodId stringhe in prodId oggetti.
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			}); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
			//dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
			//Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
		})
		.catch((err) => {
			console.log('Get product by id error: ', err);
		});
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
	//Stiamo usando mongoDB
	// Product.findByPk(prodId)
	//     .then((product) => {
	//         res.render("shop/product-detail", {
	//             product: product,
	//             pageTitle: product.title,
	//             path: "/products",
	//         }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
	//         //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
	//         //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
	//     })
	//     .catch((err) => {
	//         console.log("Get index error: ", err);
	//     });
};

exports.getIndex = (req, res, next) => {
	// Product.fetchAll() Non usiamo più sql puro, quindi questa riga sarà sostituita in: .findAll(), tuttavia stiamo usando mongoDb.
	Product
		//.fetchAll() ora usiamo mongoose
		.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'My Shop',
				path: '/',
			}); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
			//dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
			//Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
		})
		.catch((err) => {
			console.log('Get index error: ', err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		// .getCart() ora usiamo mongoose, e ha più senso fare così
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products,
			});
		})
		.catch((err) => {
			console.log('Error while getting the cart: ', err);
		});
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
	//Ora useremo mongoDB.
	// req.user
	//     .getCart()
	//     .then((cart) => {
	//         return cart
	//             .getProducts()
	//             .then((products) => {
	//                 res.render("shop/cart", {
	//                     path: "/cart",
	//                     pageTitle: "Your Cart",
	//                     products: products,
	//                 });
	//             })
	//             .catch((err) => console.log(err));
	//     })
	//     .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
	//Per come è stato precedentemente impostato, possiamo utilizzare lo stesso
	//metodo, sia per mongoDB vanilla sia per mongoose, senza cambiare niente.
	const prodId = req.body.productId;

	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('Error adding to cart: ', err);
		});
	//Ora usiamo mongoDB
	// let fetchedCart;
	// let newQuantity = 1;
	// // Product.findById(prodId, (product) => {
	// //     Cart.addProduct(product.id, product.price);
	// //     res.redirect("/cart");
	// // });
	// req.user
	//     .getCart() //Prende il carrello
	//     .then((cart) => {
	//         fetchedCart = cart;
	//         console.log("-------------------------------------", cart);
	//         return cart.getProducts({ where: { id: prodId } });
	//     }) //Salva il carrello come variabile globale, e manda il prodotto tra quelli del carrello dove l'id è uguale a prodId
	//     .then((products) => {
	//         let product;
	//         if (products.length > 0) {
	//             product = products[0];
	//         }
	//         if (product) {
	//             const oldQuantity = product.cartItem.quantity;
	//             newQuantity = oldQuantity + 1;
	//             return product;
	//         }
	//         return Product.findByPk(prodId);
	//     }) //Se quel prodotto non era presente nel carrello, allora lo cerca tra i prodotti e lo manda avanti.
	//     //Se il prodotto era presente nel carrello, allora ne salva la quantità per incrementarla di uno (la quantità
	//     //è una variabile globale), e poi manda avanti il prodotto.
	//     .then((product) => {
	//         return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
	//     }) //Al carrello che è stato precedentemente salvato come variabile globale della funzione, aggiunge il prodotto, specificandone
	//     //la quantità aggiornata (in base a se prima era già presente nel carrello o meno).
	//     .then(() => {
	//         res.redirect("/cart");
	//     })
	//     .catch((err) => {
	//         console.log("Post cart error: ", err);
	//     });
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		// .deleteItemFromCart(prodId)
		// .getCart()
		// .then((cart) => {
		//     return cart.getProducts({ where: { id: prodId } });
		// })
		// .then((products) => {
		//     const product = products[0];
		//     return product.cartItem.destroy();
		// })
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			console.log('Error deleting products: ', console.log(err));
		});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items.map((product) => {
				return {
					quantity: product.quantity,
					productData: { ...product.productId._doc },
					//Devo fare così poichè altrimenti legge solo l'oggetto del
					//product id.
				};
			});
			const order = new Order({
				user: {
					name: req.user.name,
					userId: req.user._id,
				},
				products: products,
			});
			return order.save();
		})
		//Ora usiamo mongoose
		// req.user
		// 	.addOrder()
		// Ora usiamo mongoDB
		// .getCart()
		// .then((cart) => {
		//     fetchedCart = cart;
		//     return cart.getProducts();
		// })
		// .then((products) => {
		//     tmpProducts = products;
		//     return req.user.createOrder();
		// })
		// .then((order) => {
		//     return order.addProducts(
		//         tmpProducts.map((product) => {
		//             product.orderItem = { quantity: product.cartItem.quantity };
		//             return product;
		//         })
		//     );
		// })
		// .then((result) => {
		//     return fetchedCart.setProducts(null); //Serve per cancellare tutti gli elementi
		// })
		.then((result) => {
			return req.user.clearCart();
		})
		.then((result) => {
			return res.redirect('/orders');
		})
		.catch((err) => {
			console.log('Error on posting an order: ', err);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		//Ora usiamo mongoose
		// req.user
		// 	.getOrders()
		// Ora usiamo mongoDb
		// .getOrders({ include: ["products"] }) //Aggiunge un campo per ogni ordine, dove posiziona i relativi prodotti.
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			console.log('Error getting orders: ', err);
		});
};
