const path = require("path");
const express = require('express');
const router = express.Router();
const rootDir = require("../util/path");

router.get('/',(req, res, next)=>{ //Questo è il secondo middleware
    res.sendFile(path.join(rootDir, "views","shop.html")); //possiamo comunque utilizzare setHeader(), ma la funzione
                                             //send(), è in grado di impostarlo da solo, e dinamicamente
                                             //riconoscendo il tipo mandato in risposta.
});

module.exports = router;