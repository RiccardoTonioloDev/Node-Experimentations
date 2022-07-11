const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient; //Oggetto che utilizzeremo per connetterci
require('dotenv').config();

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://' + process.env.USERNAME + ':' + process.env.PASSWORD + '@cluster0.wpbzy.mongodb.net/shop?retryWrites=true&w=majority'
    )
        //                                                                                          ^^^^^^ questo shop l'ho aggiunto io
        // Praticamente se il db con quel nome non esiste, lo crea e poi ci accede, altrimenti ci accede e basta.
        .then((client) => {
            console.log('MongoDB connected!');
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log('Error connection mongoDB: ', err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    console.log('Database not found!');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
//TUTTO questo rappresenta cosa usare in un ambiente SQL, ora è commentato per utilizzare mongoDB.
// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("node-complete", "root", "Camaleonte0220", { dialect: "mysql", host: "localhost" });
// //Questo è come si instaura una connessione al server che lavora in MySQL tramite sequelize.

// module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "node-complete",
//     password: "Camaleonte0220",
// });
// //In questo modo creiamo la pool a cui inoltrare le varie query.
// module.exports = pool.promise();
// //Successivamente la esportiamo per poterla utilizzare.
// UTILIZZIAMO SEQUELIZE (QUESTO SOPRA COMMENTATO, è L'APPROCCIO USANTE SOLO mysql2)
