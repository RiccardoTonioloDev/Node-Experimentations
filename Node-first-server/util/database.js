const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Camaleonte0220", { dialect: "mysql", host: "localhost" });
//Questo è come si instaura una connessione al server che lavora in MySQL tramite sequelize.

module.exports = sequelize;

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
