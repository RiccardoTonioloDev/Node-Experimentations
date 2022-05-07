const express = require('express');
const app = express();

app.use('/user',(req,res,next)=>{
    console.log("Entrato in user");
    res.send("<h1>Pagina degli user</h1>");
});

app.use('/',(req,res,next)=>{
    console.log("Entrato in default");
    res.send("<h1>Pagina di default</h1>");
});

app.listen(3000);