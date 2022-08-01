const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

//Non useremo .urlencoded() poichè riceviamo JSON (è cambiato il content type delle richieste)
app.use(bodyParser.json());

app.use('/feed', feedRoutes);

app.listen(8080);
