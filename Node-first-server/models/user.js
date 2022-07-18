const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: 'Product',
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
});

//Aggiungiamo allo schema dell'utente, uno metodo che in questo modo sarà utilizzabile
//da ciascun utente. (serve specificare function, perchè altrimenti non si può utilizzare
//la parola this, riferendosi allo schema).
userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = this.cart.items;
	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id, //Posso permettermi di mettere solo l'id, ci penserà
			//poi mongoose a inserirlo correttamente.
			quantity: newQuantity,
		});
	}
	const updatedCart = { items: updatedCartItems };
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
	const updatedCartItems = this.cart.items.filter(
		(item) => item.productId.toString() !== prodId
	);
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart.items = [];
	return this.save();
};

module.exports = mongoose.model('User', userSchema);
// // const Product = require("./products"); //Ora usiamo mongoose

// const getDb = require("../util/database").getDb;
// const ObjectId = require("mongodb").ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     save() {
//         const db = getDb();
//         return db.collection("users").insertOne(this);
//     }
//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex((cp) => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = this.cart.items;
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
//         }
//         const updatedCart = { items: updatedCartItems };
//         const db = getDb();
//         return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     }
//     deleteItemFromCart(prodId) {
//         const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== prodId);
//         const db = getDb();
//         return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
//     }
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map((item) => {
//             return item.productId;
//         });
//         let productsFetched;
//         return (
//             db
//                 .collection("products")
//                 .find({ _id: { $in: productIds } }) //questo ci permette di reperire tutti quei documenti
//                 //che posseggnono gli id all'interno di productIds.
//                 .toArray()
//                 .then((products) => {
//                     return products.map((p) => {
//                         return {
//                             ...p,
//                             quantity: this.cart.items.find((item) => {
//                                 return item.productId.toString() === p._id.toString();
//                             }).quantity,
//                         };
//                     });
//                 })
//                 .catch((err) => {
//                     console.log("Error while retrieving the cart: ", err);
//                 })
//         );
//     }
//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name,
//                     },
//                 };
//                 return db.collection("orders").insertOne(order);
//             })
//             .then((result) => {
//                 return { items: [] };
//             })
//             .then((newEmptyCart) => {
//                 this.cart = newEmptyCart;
//                 console.log(this._id);
//                 return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: newEmptyCart } });
//             })
//             .catch((err) => {
//                 console.log("Error while adding an order: ", err);
//             });
//     }
//     getOrders() {
//         const db = getDb();
//         return db
//             .collection("orders")
//             .find({ "user._id": new ObjectId(this._id) })
//             .toArray();
//     }
//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection("users")
//             .findOne({ _id: new ObjectId(userId) })
//             .then((user) => {
//                 return user;
//             })
//             .catch((err) => {
//                 console.log("Error returning a findById user: ", err);
//             });
//     }
// }

// //Ora usiamo mongodb
// // const Sequelize = require("sequelize");

// // const sequelize = require("../util/database");

// // const User = sequelize.define("user", {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true,
// //     },
// //     name: {
// //         type: Sequelize.STRING,
// //     },
// //     email: {
// //         type: Sequelize.STRING,
// //     },
// // });

// module.exports = User;
