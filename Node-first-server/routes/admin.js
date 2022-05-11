const express = require('express');
const path = require("path");

const router = express.Router();

const rootDir = require("../util/path");

const products = [];

// admin/add-product (GET)
router.get('/add-product',(req, res, next)=>{ //La richiesta per questo path, viene gestita
                                           //solo da questo, perchè la priorità è dal 
                                           //basso verso l'alto. (a meno che non si usi next() [Non
                                           //si deve fare dopo aver già fatto send]).
    //res.sendFile(path.join(rootDir, "views","add-product.html"));
    res.render("add-product",{
        pageTitle: "Add product",
        path: '/admin/add-product',
        formsCSS:true,
        productCSS:true,
        activeAddProduct: true
    });
}); //abbiamo aggiunto nel form /admin/ prima di product, questo perchè fuori, nell'app, è
    //dichiarato che tutte le routes in questa page appartengono alla path admin.

    // admin/product (POST)
router.post('/add-product',(req,res,next)=>{ //Verrà utilizzato solo per richieste entranti in post.
                                      //Esiste anche app.get per fare la stessa cosa ma con il get.
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
//In questo modo possiamo esportare più elementi facendo riferimento allo stesso file.
