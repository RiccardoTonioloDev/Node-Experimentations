const express = require('express');
const path = require("path");
const app = express();
app.set("view engine","ejs");
app.set("views","view"); //Il primo parametro specifica le "views", con la 's'
const bodyParser = require('body-parser');

const routerUser = require("./routes/users");
const routerDefault = require("./routes/default");

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: true}));

app.use(routerDefault);
app.use(routerUser.router);


app.listen(3000);