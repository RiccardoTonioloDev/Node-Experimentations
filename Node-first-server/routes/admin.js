const express = require('express');

const router = express.Router();

router.get('/add-product',(req, res, next)=>{ //La richiesta per questo path, viene gestita
                                           //solo da questo, perchè la priorità è dal 
                                           //basso verso l'alto. (a meno che non si usi next() [Non
                                           //si deve fare dopo aver già fatto send]).
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</form>');
});

router.post('/product',(req,res,next)=>{ //Verrà utilizzato solo per richieste entranti in post.
                                      //Esiste anche app.get per fare la stessa cosa ma con il get.
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;