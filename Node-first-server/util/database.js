const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node-complete",
    password: "Camaleonte0220",
});
//In questo modo creiamo la pool a cui inoltrare le varie query.
module.exports = pool.promise();
//Successivamente la esportiamo per poterla utilizzare.
