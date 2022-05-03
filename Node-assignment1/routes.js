const fs = require('fs');
const { parse } = require('path');

const routesHandling = (req,res) =>{
    const url = req.url;
    const method = req.method;

    if(url==='/'){
        res.setHeader('Content-Type','text/html');
        res.write("<html><head>Home</head><body><h1>Landing Page</h1>");
        res.write("<form action='/create-user' method='POST'><input type='text' name='username'><button type='submit'>Send</button></form>");
        res.write("</body></html>");
        return res.end();
    }
    if(url==='/users'){
        res.setHeader('Content-Type','text/html');
        res.write("<html><head>Users</head><body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul>");
        res.write("</body></html>");
        return res.end();
    }
    if(url==='/create-user'){
        const body = [];
        req.on('data', (chunk) =>{
            body.push(chunk);
        });
        return req.on('end', ()=>{
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message = parsedBody.split("=")[1];
            console.log(message);
            fs.writeFile("username.txt",message,(err)=>{
                res.statusCode = 302 //redirect
                res.setHeader('Location','/users'); //Location con la L maiuscola
                //Ho avuto un problema poichè andavo a indirizzare alla pagina sbagliata.
                return res.end();
            });
        });
    }

};

module.exports = routesHandling;