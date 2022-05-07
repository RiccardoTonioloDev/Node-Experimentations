const express = require('express');
const router = express.Router();

router.get('/',(req, res, next)=>{ //Questo è il secondo middleware
    res.send('<h1>Hello from express</h1>'); //possiamo comunque utilizzare setHeader(), ma la funzione
                                             //send(), è in grado di impostarlo da solo, e dinamicamente
                                             //riconoscendo il tipo mandato in risposta.
});

module.exports = router;