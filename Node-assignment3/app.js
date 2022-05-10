const express = require("express");
const path = require("path");
const routerUsers = require("./routes/users");
const routerDefault = require("./routes/default");

const app = express();

app.use(express.static(path.join(__dirname,"public")));

app.use(routerUsers);
app.use(routerDefault);

app.listen(3000);
