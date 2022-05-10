const path = require("path");
const express = require('express');
const router = express.Router();
const rootDir = require("../util/path");
const adminData = require("./admin");

router.get('/',(req, res, next)=>{ //Questo è il secondo middleware
    //console.log("shop.js",adminData.products)
    //res.sendFile(path.join(rootDir, "views","shop.html")); //possiamo comunque utilizzare setHeader(), ma la funzione
                                             //send(), è in grado di impostarlo da solo, e dinamicamente
                                             //riconoscendo il tipo mandato in risposta.
    res.render('shop'); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
                        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
});

module.exports = router;