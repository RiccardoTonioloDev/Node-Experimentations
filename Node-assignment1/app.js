const http = require('http');
const routing = require('./routes');

    const Server = http.createServer(routing);
Server.listen(3000);
