const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Product = require('../models/products');
const Order = require('../models/order');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
//Inizializziamo stripe, che ci permetterà di creare poi sessioni di pagamento.

const ITEMS_PER_PAGE = 2;

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
	const page = +req.query.page || 1; //Quel + effettua il casting da stringa a numero.
	//Mentre se page non è definito, grazie all ||1, l'viene dato come valore di default.
	let totalItems;
	// Product.fetchAll() Non usiamo più sql puro, quindi questa riga sarà sostituita in: .findAll(), tuttavia stiamo usando mongoDb.
	Product.find()
		.countDocuments()
		.then((numberOfProducts) => {
			totalItems = numberOfProducts;
			return (
				Product
					//.fetchAll() ora usiamo mongoose
					.find()
					.skip((page - 1) * ITEMS_PER_PAGE) //Skippa i primi n risultati (secondo il numero inserito come parametro)
					.limit(ITEMS_PER_PAGE)
				//Limita l'estrazione al numero di risultati inseriti come numero tramite parametro.
				//NOTA BENE: il limit e lo skip avvengono come filtraggi sul database, e non post fetch sul server!!!
			);
		})

		.then((products) => {
			return res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Products',
				path: '/products',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			}); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
			//dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
			//Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
	const page = +req.query.page || 1; //Quel + effettua il casting da stringa a numero.
	//Mentre se page non è definito, grazie all ||1, l'viene dato come valore di default.
	let totalItems;
	// Product.fetchAll() Non usiamo più sql puro, quindi questa riga sarà sostituita in: .findAll(), tuttavia stiamo usando mongoDb.
	Product.find()
		.countDocuments()
		.then((numberOfProducts) => {
			totalItems = numberOfProducts;
			return (
				Product
					//.fetchAll() ora usiamo mongoose
					.find()
					.skip((page - 1) * ITEMS_PER_PAGE) //Skippa i primi n risultati (secondo il numero inserito come parametro)
					.limit(ITEMS_PER_PAGE)
			); //Limita l'estrazione al numero di risultati inseriti come numero tramite parametro.
		})

		.then((products) => {
			return res.render('shop/index', {
				prods: products,
				pageTitle: 'My Shop',
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			}); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
			//dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
			//Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCheckout = (req, res, next) => {
	let products;
	let total = 0;
	req.user
		.populate('cart.items.productId')
		// .getCart() ora usiamo mongoose, e ha più senso fare così
		.then((user) => {
			total = 0;
			products = user.cart.items;
			products.forEach((product) => {
				total += product.quantity * product.productId.price;
			});

			return stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: products.map((p) => {
					return {
						name: p.productId.title,
						description: p.productId.description,
						amount: p.productId.price * 100,
						currency: 'usd',
						quantity: p.quantity,
					};
				}),
				success_url:
					req.protocol +
					'://' +
					req.get('host') +
					'/checkout/success',
				cancel_url:
					req.protocol + '://' + req.get('host') + '/checkout/cancel',
			});
		})
		.then((session) => {
			return res.render('shop/checkout', {
				path: '/checkout',
				pageTitle: 'Checkout',
				products: products,
				totalSum: total,
				publicKey: process.env.STRIPE_PUBLIC_KEY,
				sessionId: session.id,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCheckoutSuccess = (req, res, next) => {
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
					email: req.user.email,
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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// exports.postOrder = (req, res, next) => {
// 	req.user
// 		.populate('cart.items.productId')
// 		.then((user) => {
// 			const products = user.cart.items.map((product) => {
// 				return {
// 					quantity: product.quantity,
// 					productData: { ...product.productId._doc },
// 					//Devo fare così poichè altrimenti legge solo l'oggetto del
// 					//product id.
// 				};
// 			});
// 			const order = new Order({
// 				user: {
// 					email: req.user.email,
// 					userId: req.user._id,
// 				},
// 				products: products,
// 			});
// 			return order.save();
// 		})
// 		//Ora usiamo mongoose
// 		// req.user
// 		// 	.addOrder()
// 		// Ora usiamo mongoDB
// 		// .getCart()
// 		// .then((cart) => {
// 		//     fetchedCart = cart;
// 		//     return cart.getProducts();
// 		// })
// 		// .then((products) => {
// 		//     tmpProducts = products;
// 		//     return req.user.createOrder();
// 		// })
// 		// .then((order) => {
// 		//     return order.addProducts(
// 		//         tmpProducts.map((product) => {
// 		//             product.orderItem = { quantity: product.cartItem.quantity };
// 		//             return product;
// 		//         })
// 		//     );
// 		// })
// 		// .then((result) => {
// 		//     return fetchedCart.setProducts(null); //Serve per cancellare tutti gli elementi
// 		// })
// 		.then((result) => {
// 			return req.user.clearCart();
// 		})
// 		.then((result) => {
// 			return res.redirect('/orders');
// 		})
// 		.catch((err) => {
// 			const error = new Error(err);
// 			error.httpStatusCode = 500;
// 			return next(error);
// 		});
// };

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
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;

	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error('No order found.'));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Unauthorized.'));
			}
			const invoiceName = 'Invoice-' + orderId + '.pdf';
			const invoicePath = path.join('Data', 'invoices', invoiceName);

			const pdfDoc = new PDFDocument(); //Crea un nuovo editor di PDF.
			res.setHeader('Content-Type', 'application/pdf'); //Ci permette di mandare il pdf come risposta visualizzabile.
			res.setHeader(
				'Content-Disposition',
				'inline; filename="' + invoiceName + '"'
				//Inline ci permette di aprirlo subito all'interno del nostro browser;
				//Al posto di inline potremmo mettere attached, che ci permette di scaricare
				//istantaneamente il file.
			);
			pdfDoc.pipe(fs.createWriteStream(invoicePath)); //Setta uno stream per scrivere all'interno del file system.
			pdfDoc.pipe(res); //Allo stesso modo setta uno stream per mandare i dati volta per volta in risposta.

			pdfDoc.fontSize(26).text('Invoice', {
				underline: true,
			}); //Scrittura di testo + configurazione;
			let totalPrice = 0;
			pdfDoc.text('----------------------');
			order.products.forEach((prod) => {
				pdfDoc
					.fontSize(14)
					.text(
						prod.productData.title +
							' - ' +
							prod.quantity +
							'x $' +
							prod.productData.price
					);
				totalPrice += prod.quantity * prod.productData.price;
			});
			pdfDoc.fontSize(26).text('----------------------');
			pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

			pdfDoc.end(); //Finisce la scrittura, quindi notifica del fatto che non c'è più niente da scrivere.
			// fs.readFile(invoicePath, (err, data) => { Questo è un modo per mandare file buono solo
			// se il file che si sta mandando è veramente piccolo, poichè altrimenti bisognerebbe leggere
			// un file intero, e solo dopo mandarlo
			// 	if (err) {
			// 		return next(err);
			// 	}
			// 	res.setHeader('Content-Type', 'application/pdf'); //Ci permette di mandare il pdf come risposta visualizzabile.
			// 	res.setHeader(
			// 		'Content-Disposition',
			// 		'inline; filename="' + invoiceName + '"'
			// 		//Inline ci permette di aprirlo subito all'interno del nostro browser;
			// 		//Al posto di inline potremmo mettere attached, che ci permette di scaricare
			// 		//istantaneamente il file.
			// 	);
			// 	res.send(data);
			// });

			//Non facciamo più nemmeno così poichè ora creiamo da zero il nostro file pdf.
			// const file = fs.createReadStream(invoicePath);
			// //In questo modo creiamo uno stream di lettura verso il path selezionato.

			// res.setHeader('Content-Type', 'application/pdf'); //Ci permette di mandare il pdf come risposta visualizzabile.
			// res.setHeader(
			// 	'Content-Disposition',
			// 	'inline; filename="' + invoiceName + '"'
			// 	//Inline ci permette di aprirlo subito all'interno del nostro browser;
			// 	//Al posto di inline potremmo mettere attached, che ci permette di scaricare
			// 	//istantaneamente il file.
			// );
			// file.pipe(res);
			// //In questo modo utilizziamo lo stream creato prima, e lo incanaliamo dentro
			// //uno stream scrivibile(res), di modo da poter passare chunk per chunk, l'intero
			// //file.
		})
		.catch((err) => next(err));
};
