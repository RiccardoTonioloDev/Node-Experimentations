// const http = require("http"); //Modo per importare file in Node
// const routes = require("./routes"); //C'è il './' appunto perchè routes (rimosso)
//non è un file disponibile a livello
//globale.
// const https = require('https');
const express = require('express'); //importiamo express
require('dotenv').config();
//const expressHbs = require("express-handlebars");

//app.engine("handlebars",expressHbs({
//    layoutsDir : 'views/layouts',
//    defaultLayout: 'main-layout'
//}));//Per usare handlebars dobbiamo per forza configurare manualmente
//l'engine, poichè non è incluso fin da sempre in express.
//app.set('view engine', 'pug');//Possiamo importare direttamente così
//solo perchè pug è ottimizzato per express.

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.wpbzy.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const session = require('express-session'); //In questo modo possiamo utilizzare le sessioni.
const MongoDBStore = require('connect-mongodb-session')(session); //Serve per usare mongoDB come supporto per le sessioni.
//Gli passiamo la sessione creata nella riga sopra per poterla utilizzare.
const csrf = require('csurf'); //Per protezione da attacchi di tipo CSRF
const flash = require('connect-flash'); //Serve per spostare dati da una sessione ad un'altra (usando la sessione)
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//Useremmo queste variabili se gestissimo noi i certificati SSL/TLS, ma nel nostro caso lo faremmo gestire all'hosting provider.
// const privateKey = fs.readFileSync('server.key'); //Per leggere tutto d'un pezzo la chiave privata (Azione bloccante per il server)
// const certificate = fs.readFileSync('server.cert');

const multer = require('multer');

const store = new MongoDBStore({
	uri: MONGODB_URI, //URI per la connessione al database.
	collection: 'sessions', //collezione dove verranno messe in storage le varie sessioni.
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	//Funzione da utilizzare per specificare dove salvare.
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	//Funzione da utilizzare per specificare con che nome salvare.
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
	//IL NULL VIENE PASSATO COME PRIMO PARAMETRO, per specificare che non ci sono
	//errori.
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
		//In questo caso si passa.
	} else {
		cb(null, false);
		//In questo caso non si passa.
	}
};

// const mongoConnect = require("./util/database").mongoConnect; //Cancellato in quanto ora usiamo mongoose
const User = require('./models/user');

// Ora usiamo mongoDB quindi non usiamo più nessun derivato di SQL.
// const sequelize = require("./util/database"); //Ora questa sarà la pool
// che potremmo utilizzare per effettuare le nostre query (sequelize prima si chiamava "db")
// const Product = require("./models/products");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");
// db.execute("SELECT * FROM products")
//     .then((result) => {
//         //Per gestire l'arrivo dei dati richiesti in maniera asincrona.
//         console.log(result[0], result[1]);
//     })
//     .catch((err) => {
//         //Per gestire eventuali errori nel caso qualcosa dovesse fallire.
//         console.log("Errore connessione al database: ", err);
//     }); SEMPLICE PROVA DI UTILIZZO DEL DATABASE MySQL

const app = express(); //In questo modo inizializziamo un oggetto per fare si che
//express riesca a gestire per noi un bel po' di cose
//dietro le quinte.
app.set('view engine', 'ejs');
app.set('views', 'views'); //In questo modo con il primo parametro specifichiamo
//che vogliamo dire dove sono presenti le nostre
//views (specifichiamo cosa deve fare la funzione),
//mentre con il secondo, diciamo a che cartella
//si possono trovare
app.use(express.static(path.join(__dirname, 'public'))); //In questo modo qualsiasi richiesta di file (quindi elementi statici)
//viene inoltrata all'interno di path/public (per questo in shop.html, non
//indirizziamo a public/css/main.css, ma solo a css/main.css)
app.use('/images', express.static(path.join(__dirname, 'images')));
//Esattamente come il middleware per contenuti statici sopra, ma in questo caso,
//specifichiamo il path a cui deve corrispondere.

//Creiamo un filestream, per scrivere man mano le richieste che arrivano.
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{
		//Specifica che la scrittura del file di log va in append
		flags: 'a',
	}
);

//Non utilizzato in quanto altrimenti non funzionano le API, indagherò più avanti
// app.use(
// 	helmet({
// 		contentSecurityPolicy: false,
// 	})
// );

// app.use(
// 	helmet.contentSecurityPolicy({
// 		directives: {
// 			'script-src': ["'self'", 'js.stripe.com'],
// 		},
// 	})
// );
// app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// //per intestazioni sicure
app.use(compression()); //per compressione degli assets
app.use(morgan('combined', { stream: accessLogStream })); //per logging delle richieste
//Usiamo il filestream di prima per loggare le richieste tramite morgan.

app.use(bodyParser.urlencoded({ extended: true })); //Effettuerà tutto il body parsing, che prima noi
//dovevamo fare manualmente.
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
//In questo modo specificheremo a multer il modo in cui dovrà salvare il file, e
//dove, tramite l'oggetto per il settaggio, creato precedentemente.

app.use(
	session({
		secret: process.env.SECRET_FOR_SESSIONS, //Per usare la funzione di hash sull'identificativo
		//della sessione (Si usa appunto quello che si imposta qui).
		resave: false, //Per fare si che non si risalvi ogni volta la sessione, ma solo quando vengono
		//apportati dei cambiamenti (per fare si che le performance non siano scadenti).
		saveUninitialized: false, //Per fare si che non si crei una sessione, fino a che non c'è
		//bisogno di usarla. (sempre per questioni di performance)
		store: store, //Per usare lo store di supporto creato in mongoDB.
	})
);

app.use(csrfProtection); //Creiamo un middleware per abilitare la protezione.
app.use(flash());

app.use((req, res, next) => {
	//In questo modo per ogni richiesta, ogni view avrà queste due variabili
	//di default.
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			//console.log('Error while loading user from session: ', err);
			//throw new Error(err);
			next(new Error(err));
		});
});

//Ora usiamo le sessioni, quindi questo middleware non ci serve più.
// app.use((req, res, next) => {
// 	User.findById('62ceddab0afbe1c5aa424966')
// 		.then((user) => {
// 			req.user = user;
// 			next();
// 		})
// 		.catch((err) => {
// 			console.log(
// 				'Aggiunzione utente di default a richiesta (ERRORE): ',
// 				err
// 			);
// 		});
// 	// User.findByPk(1)
// 	//     .then((user) => {
// 	//         req.user = user; //Sto aggiungendo un campo alla richiesta
// 	//         //In questo modo successivi middleware, lo avranno a disposizione,
// 	//         //Per gestire lo shop, nel contesto dell'utente trattato.
// 	//         next();
// 	//     })
// 	//     .catch((err) => {
// 	//         console.log("Errore caricamento utente: ", err);
// 	//     });
// });

//const { removeListener } = require('process');
//Per importare moduli non globali però,
//all'inizio del nome del modulo, serve
//usare il './' !

//function rqListener(req,res){}

//http.createServer(removeListener); //Bisogna passare come parametro alla
//funzione createServer(), una funzione
//che verrà eseguita ogni volta che verrà
//eseguita una richiesta al server.
//A questa funzione, per ogni richiesta,
//verranno passati 2 parametri:
//1) Dati di entrata (req);
//2) Dati di uscita (res).
//Sono le variabili con cui è possibile
//gestire le richieste in entrata, e le
//loro relative risposte.

//Possiamo fare lo stesso anche con funzioni anonime

//La funzione createServer(), applicata all'oggetto http, ci restituisce
//un oggetto server. Per questo lo assegnamo a una variabile di tipo
//const: poichè non abbiamo intenzione di andare a modificarla.
//const server = http.createServer(routes); //Se arriva una richiesta, viene usata la funzione
//creata in routes. I parametri req e res vengono
//direttamente passati alla funzione.
//Infatti nell'altro file abbiamo esportato la
//funzione, che richiede quei due parametri.
//Allo stesso modo, li è implicita la richiesta
//di parametri (rimosso)

//app.use((req, res, next)=>{ //Questo è il primo middleware
//Definiamo quindi, come gestire una qualsiasi richiesta
//entrante, definendo i middleware tramite ".use", dove
//i tre parametri come prima sono: richiesta, risposta e
//next (descritto dopo).
//    console.log('In the middleware');
//    next(); //Ci permette di passare al prossimo middlware presente nel codice
//});

//Tutti gli app.use sono stati spostati nel route di admin
//app.use('/add-product',(req, res, next)=>{ //La richiesta per questo path, viene gestita
//solo da questo, perchè la priorità è dal
//basso verso l'alto. (a meno che non si usi next() [Non
//si deve fare dopo aver già fatto send]).
//    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</form>');
//});

//app.post('/product',(req,res,next)=>{ //Verrà utilizzato solo per richieste entranti in post.
//Esiste anche app.get per fare la stessa cosa ma con il get.
//    console.log(req.body);
//    res.redirect('/');
//});

//app.use('/',(req, res, next)=>{ //Questo è il secondo middleware
//    res.send('<h1>Hello from express</h1>'); //possiamo comunque utilizzare setHeader(), ma la funzione
//send(), è in grado di impostarlo da solo, e dinamicamente
//riconoscendo il tipo mandato in risposta.
//});

//const server = http.createServer(app); //A questo punto possiamo utilizzare il nostro oggetto creato
//prima tramite express.

//server.listen(3000); //Attiva la modalità listen sul server.
//Questo vuol dire che il server continuerà ad
//ascoltare richieste sulla porta 3000
//dell'indirizzo passato (in questo caso si usa
//il default, ovvero localhost).

app.use('/admin', adminRoutes); //In questo modo considerà in modo automatico le routes che gli abbiamo
//dato all'interno del file admin come middleware.
//Con lo /admin, andiamo a denotare nell'url la path di appartenenza.
app.use(shopRoutes); //In questo modo considerà in modo automatico le routes che gli abbiamo
//dato all'interno del file shop come middleware.

app.use(authRoutes);

app.get('/500', errorController.get500);

//PAGINA DI DEFAULT
app.use('/', errorController.get404);

//Posizioniamo il gestore degli errori sotto il gestore dei 404, di modo che non
//venga mai accesso da alcuna richiesta, se non da Express.js stesso, per la
//gestione degli errori.
app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).render('500', {
		pageTitle: 'Error Occured',
		path: '500',
		isAuthenticated: req.session.isLoggedIn,
	});
});

// Visto che ora utilizzeremo mongoDB, tutto ciò che riguarda il server in phpMyAdmin, non serve più.
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// //Con constraints=true stiamo dicendo che deve essere prima creata la tabella User, e solo successivamente la tabella product.
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem }); // Con il through noi diciamo qual'è la tabella di giunzione.
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// let copyUser;
// sequelize
//     //Forzando il sync, (non si usa in produzione), facciamo in modo che le tabelle vengano cambiate in caso di modifiche allo schema.
//     //Avviene anche in caso di eventuali relazioni.
//     // .sync({ force: true })
//     .sync()
//     .then((result) => {
//         return User.findByPk(1);
//         //console.log(result);
//     })
//     .then((user) => {
//         if (!user) {
//             return User.create({ name: "Max", email: "test@test.com" });
//         }
//         return user;
//     })
//     .then((user) => {
//         copyUser = user;
//         return user.getCart();
//     })
//     .then((cart) => {
//         if (!cart) {
//             copyUser.createCart();
//         }
//     })
//     .then((cart) => {
//         app.listen(3000); //Effettua sia la creazione del server, che la messa in
//         //listen di questo.
//         //Mettendo il server qui dentro, diciamo che il server verrà avviato, solo
//         //se la connessione e sync del database avviene con successo.
//     })
//     .catch((err) => {
//         console.log("Errore sync: ", err);
//     }); //Per ogni modello che trova creato all'interno del server, crea una tabella corrispondente.

// Ora la connessione la facciamo direttamente con mongoose
// mongoConnect(() => {
//     app.listen(3000);
// });
mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		// Ora riusciamo a crearceli da soli gli utenti
		// User.findOne().then((user) => {
		// 	if (!user) {
		// 		const user = new User({
		// 			name: 'Max',
		// 			email: 'max@test.com',
		// 			cart: {
		// 				items: [],
		// 			},
		// 		});
		// 		user.save();
		// 	}
		// });
		app.listen(process.env.PORT || 3000);
		//Se volessimo gestire noi il nostro server in modalità https, allora questo sotto sarebbe il metodo
		// https
		// 	.createServer({ key: privateKey, cert: certificate }, app)
		// 	//Il primo parametro è un oggetto che accetta una chiave privata e una pubblica (cert);
		// 	//Il secondo parametro è il nostro gestore delle richieste (quindi app, l'oggetto creato tramite express).
		// 	.listen(process.env.PORT || 3000);
	})
	.catch((err) => {
		console.log('Error connecting to the database or to the server: ', err);
	});
