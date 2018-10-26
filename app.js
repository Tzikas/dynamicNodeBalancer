const body = require('body-parser');
const express = require('express');
const request = require('request');

let port = 3000;
let arr = ['3000']
let servers = ['http://localhost:3000'];
let cur = 0;   

const handle = serverNum => (req, res) => {
 console.log(`server ${serverNum}`, req.method, req.url, req.body);
 res.send(`Hello from server ${serverNum}!`);
};


const handler = (req, res) => {

    const _req = request({ url: servers[cur] + req.url }).on('error', error => {
        res.status(500).send(error.message);
    });
    req.pipe(_req).pipe(res);
    cur = (cur + 1) % servers.length;
};


const profilerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log('Completed', req.method, req.url, Date.now() - start);
        if(Date.now() - start > 15){
            //Test if too slow & add server
            port++; 
            servers.push(`http://localhost:${port}`)
            arr.push(String(port))
            arr[arr.length-1] = express()
            arr[arr.length-1].use(body.json())
            arr[arr.length-1].get('*', handle(port)).post('*', handle(port));
            arr[arr.length-1].listen(port); 
        }


    });


    next();
};


arr[0] = express()
arr[0].use(body.json())
arr[0].get('*', handle(port)).post('*', handle(port));
arr[0].listen(port); 


/*
for(let a=0; a<arr.length; a++){
    arr[a] = express() 
    arr[a].use(body.json())
    arr[a].get('*', handle(a)).post('*', handle(a));
    arr[a].listen(3000+a); 
}
*/
const server = express().use(profilerMiddleware).get('*', handler).post('*', handler);

server.listen(8080);






































/*const body = require('body-parser');
const express = require('express');
const request = require('request');

const app1 = express(); 
const app2 = express();

let arr = [app1,app2]



app1.use(body.json());
app2.use(body.json());
   




//console.log('Hello World'); 

const servers = ['http://localhost:3000', 'http://localhost:3001' ];
let cur = 0;   


const handle = serverNum => (req, res) => {
 console.log(`server ${serverNum}`, req.method, req.url, req.body);
 res.send(`Hello from server ${serverNum}!`);
};


app1.get('*', handle(1)).post('*', handle(1));
app2.get('*', handle(2)).post('*', handle(2));




app1.listen(3000); 
app2.listen(3001);

const handler = (req, res) => {

    const _req = request({ url: servers[cur] + req.url }).on('error', error => {
        res.status(500).send(error.message);
    });
    req.pipe(_req).pipe(res);
    cur = (cur + 1) % servers.length;
};






const profilerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log('Completed', req.method, req.url, Date.now() - start);
    });
    next();
};

//const server = express().get('*', handler).post('*', handler);
const server = express().use(profilerMiddleware).get('*', handler).post('*', handler);



server.listen(8080);


*/
