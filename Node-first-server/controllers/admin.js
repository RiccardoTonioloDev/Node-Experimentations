const Product = require('../models/products');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
	//È un possibile modo di proteggere le routes, ma non è scalabile
	// if (!req.session.isLoggedIn) {
	// 	return res.redirect('/login');
	// }

	//La richiesta per questo path, viene gestita
	//solo da questo, perchè la priorità è dal
	//basso verso l'alto. (a meno che non si usi next() [Non
	//si deve fare dopo aver già fatto send]).
	//res.sendFile(path.join(rootDir, "views","add-product.html"));
	res.render('admin/edit-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
}; //abbiamo aggiunto nel form /admin/ prima di product, questo perchè fuori, nell'app, è
//dichiarato che tutte le routes in questa page appartengono alla path admin.

exports.postAddProduct = (req, res, next) => {
	// //Verrà utilizzato solo per richieste entranti in post.
	// //Esiste anche app.get per fare la stessa cosa ma con il get.
	const title = req.body.title;
	const image = req.file;
	const description = req.body.description;
	const price = req.body.price;
	if (!image) {
		//Stiamo facendo qui la validazione di image, poichè multer in automatico
		//restituisce un elemento falso se il filtraggio non è andato a buon
		//segno (utilizzando gli oggetti di configurazione in app.js)
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			validationErrors: [],
			product: {
				title: title,
				description: description,
				price: price,
			},
			errorMessage: "Attached file it's not an image.",
		});
	}
	const errors = validationResult(req);
	console.log(errors.array()[0]);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			validationErrors: errors.array(),
			product: {
				title: title,
				imageUrl: imageUrl,
				description: description,
				price: price,
			},
			errorMessage: errors.array()[0].msg,
		});
	}

	const imageUrl = image.path;
	//Restituisce il path per andare a prelevare quella immagine.

	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		description: description,
		price: price,
		userId: req.user,
		/* Mongoose ci permette di passare l'id anche in questo modo */
	});
	// In mongoose le cose si fanno in modo leggermente diverso
	// console.log('USER RETRIEVED: ', req.user);
	// const product = new Product(title, price, description, imageUrl, null, req.user._id);
	product
		.save() //Ora che stiamo utilizzando mongoose, il metodo di salvataggio è direttamente fornito da
		//mongoose, e non da noi (come avevamo semplicemente fatto per mongoDB vanilla).
		.then((result) => {
			console.log('Product created!');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			// console.log('Error while posting a new product: ', err);
			//Per quanto sia capibile usare questo tipo di approccio, solitamente
			//per problemi più grandi, si utilizzano pagine apposite.
			// return res.status(422).render('admin/edit-product', {
			// 	pageTitle: 'Add Product',
			// 	path: '/admin/add-product',
			// 	editing: false,
			// 	hasError: true,
			// 	validationErrors: [],
			// 	product: {
			// 		title: title,
			// 		imageUrl: imageUrl,
			// 		description: description,
			// 		price: price,
			// 	},
			// 	errorMessage: 'Database operation failed, please try again.',
			// });

			//Possiamo fare anche così ma sarebbe un'ernorme duplicazione del codice
			//res.redirect('/500');

			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
			//Quando un errore è passato come argomento in next(), Express lo
			//identifica subito, e lo gestisce con un middleware apposito.
			//Ovviamente il middlware speciale lo dovremo creare noi all'interno
			//di app.js
		});

	//Commentato in quanto ora facciamo tutto in mongoDB
	// console.log("REQ USER ID: " + req.user.id);
	// // const newProduct = Product.build({
	// //     title: title,
	// //     price: price,
	// //     imageUrl: imageUrl,
	// //     description: description,
	// //     userId: req.user.id,
	// // });
	// // console.log(newProduct);
	// // newProduct
	// //     .save()
	// //     .then((result) => {
	// //         console.log("Created product.");
	// //         res.redirect("/admin/products");
	// //     })
	// //     .catch((err) => {
	// //         console.log("Adding product error: ", err);
	// //     }); METODO PER REALIZZARLO IN MANIERA DIFFERITA (PRIMA SI CREA, E POI SI SALVA SUL DATABASE).
	// req.user
	//     //  questo metodo viene automaticamente creato, quando nel main noi andiamo a creare la relazione 1
	//     // a molti all'interno del main. In tal modo l'id dello user è già inserito.
	//     .createProduct({
	//         title: title,
	//         price: price,
	//         imageUrl: imageUrl,
	//         description: description,
	//     })
	//     // Product.create({
	//     //     title: title,
	//     //     price: price,
	//     //     imageUrl: imageUrl,
	//     //     description: description,
	//     //     userId: req.user.id,
	//     // })
	//     .then((result) => {
	//         console.log("Created product.");
	//         res.redirect("/admin/products");
	//     })
	//     .catch((err) => {
	//         console.log("Adding product error: ", err);
	//     });
	// // const product = new Product(null, title, imageUrl, description, price); //serve il null poichè è la prima volta che costruiamo l'oggetto se
	// // //lo stiamo creando tramite questa funzione.
	// // product
	// //     .save()
	// //     .then(() => {
	// //         res.redirect("/");
	// //     })
	// //     .catch((err) => {
	// //         console.log("Errore add prodcut: ", err);
	// //     }); Ora lo facciamo in sequelize, quindi queste istruzioni non servono più
};

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// .select("title price -_id") //Ci permette di selezionare solo particolari caratteristiche dei prodotti reperiti (il -_id sta a
		//dire che l'id deve essere espressamente escluso: ALTRIMENTI è SEMPRE INCLUSO)
		// .populate("userId", "name") //Tramite questo metodo, mongoose reperisce l'intero user e lo posiziona al posto del campo userId.
		//Con il secondo parametro, specifichiamo quali campi prendere da tutti quelli reperiti per l'oggetto
		//popolato.
		// .fetchAll() //ora usiamo mongoose
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
			// console.log('Admin getProducts error: ', err);
		});
	//Ora facciamo tutto in mongoDB
	// req.user
	//     .getProducts()
	//     // Product.findAll()
	//     .then((products) => {
	//         res.render("admin/products", {
	//             prods: products,
	//             pageTitle: "Admin Products",
	//             path: "/admin/products",
	//         }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
	//         //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
	//         //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
	//     })
	//     .catch((err) => {
	//         console.log("Admin getProducts error: ", err);
	//     });
};

exports.getEditProduct = (req, res, next) => {
	//La richiesta per questo path, viene gestita
	//solo da questo, perchè la priorità è dal
	//basso verso l'alto. (a meno che non si usi next() [Non
	//si deve fare dopo aver già fatto send]).
	//res.sendFile(path.join(rootDir, "views","add-product.html"));
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId; //In questo modo si prende l'Id dall'URL
	Product.findById(prodId) //Così prendi i prodotti relativi all'utente.
		//Product.findByPk(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				errorMessage: null,
				validationErrors: [],
				hasError: false,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
			// console.log('getEditProduct admin error: ', err);
		});
	// req.user
	//     .getProducts({ where: { id: prodId } }) //Così prendi i prodotti relativi all'utente.
	//     //Product.findByPk(prodId)
	//     .then((products) => {
	//         const product = products[0];
	//         if (!product) {
	//             return res.redirect("/");
	//         }
	//         res.render("admin/edit-product", {
	//             pageTitle: "Edit product",
	//             path: "/admin/edit-product",
	//             editing: editMode,
	//             product: product,
	//         });
	//     })
	//     .catch((err) => {
	//         console.log("getEditProduct admin error: ", err);
	//     });
};

exports.postEditProduct = (req, res, next) => {
	const id = req.body.productId;
	const title = req.body.title;
	const image = req.file;
	const description = req.body.description;
	const price = req.body.price;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			validationErrors: errors.array(),
			product: {
				title: title,
				description: description,
				price: price,
				_id: id,
			},
			errorMessage: errors.array()[0].msg,
		});
	}

	Product.findById(id)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = title;
			if (image) {
				product.imageUrl = image.path;
			}
			product.description = description;
			product.price = price;

			return product.save().then((result) => {
				console.log('Updated product!');
				res.redirect('/admin/products');
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
			// console.log('PostEditProduct error admin: ', err); // Questo catcher, prenderà gli errori eventuali, da entrambi i then.
		});
	// Ora utilizziamo mongoose
	// const product = new Product(title, price, description, imageUrl, id);
	// product
	//     .save()
	//     .then((result) => {
	//         console.log("Updated product!");
	//         res.redirect("/admin/products");
	//     })
	//     .catch((err) => {
	//         console.log("PostEditProduct error admin: ", err); // Questo catcher, prenderà gli errori eventuali, da entrambi i then.
	//     });
	// Ora usiamo mongoDb
	// Product.findByPk(id)
	//     .then((product) => {
	//         product.title = title;
	//         product.imageUrl = imageUrl;
	//         product.description = description;
	//         product.price = price;
	//         return product.save(); //In questo modo andiamo a salvare le modifiche all'interno del database.
	//         //Utilizza la chiave primaria (in questo caso id), e nel caso il prodotto non esistessa,
	//         //allora semplicemente creerebbe un nuovo recod.
	//         //FACCIO IL RETURN DI PRODUCT.SAVE solo perchè così non faccio troppo nesting di promesse, andando
	//         //a gestire le eventuali promesse al di sotto del then. Cioè la promessa di un then, diventa l'input
	//         //del prossimo then.
	//     })
	//     .then((result) => {
	//         console.log("Updated product!");
	//         res.redirect("/admin/products");
	//     })
	//     .catch((err) => {
	//         console.log("PostEditProduct error admin: ", err); // Questo catcher, prenderà gli errori eventuali, da entrambi i then.
	//     });

	// updatedProduct.save();
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.body.productId;

	Product //findByIdAndRemove(id) per verificare che sia il vero proprietario dell'oggetto a effettuare l'operazione di rimozione,
		//utilizziamo questo tipo di comando.
		.deleteOne({ _id: id, userId: req.user._id })
		//.deleteById(id) ora usiamo mongoose
		.then(() => {
			console.log('DESTORYED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
			// console.log('Error in effective deletion of a product: ', err);
		});
	// Product.deleteById(id); ora utilizzo sequelize
	// Product.findByPk(id)
	//     .then((product) => {
	//         product.destroy(); //Se invoco questo metodo sul prodotto, vado a inviare una query per eliminarlo
	//         //Altrimenti posso farlo direttamente sul modello Product, utilizzando all'interno delle parentesi,
	//         //un oggetto con specifica where.
	//     })
	//     .then((result) => {
	//         console.log("Destroyed product!");
	//         res.redirect("/admin/products");
	//     })
	//     .catch((err) => {
	//         console.log("Errore deleting product: ", err);
	//     });
};
