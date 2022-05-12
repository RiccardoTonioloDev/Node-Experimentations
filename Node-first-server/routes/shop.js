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
    const products = adminData.products;
    res.render('shop',{
        prods: products,
        pageTitle: "My Shop",
        path: '/',
        hasProducts: products.length > 0,
        productCSS: true,
        activeShop: true
    }); //Usiamo la funzione di rendering, inclusa in express, che sa già (perchè definito prima in app.js)
                        //dove trovare le views, per renderizzare il template shop.pug posizionato all'interno di views.
                        //Il secondo argomento deve essere di tipo oggetto, ed è per questo che ne creiamo uno al volo.
});

module.exports = router;