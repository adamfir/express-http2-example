const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const fs = require("fs");
const spdy = require("spdy");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const appH2 = express();
const portH2 = process.env.PORT_H2 || 443;
appH2.use(app);
appH2.set('port', portH2);

const port = process.env.PORT || 80;
app.set('port', port);

const server = http.createServer(app);
server.listen(app.get("port"), ()=> {
  console.log("Server HTTP listening on port " + app.get("port"));
});

// reference: https://www.npmjs.com/package/spdy
const serverH2 = spdy.createServer({
  // key: fs.readFileSync(__dirname + '/certificate/private.key'),
  // cert: fs.readFileSync(__dirname + '/certificate/certificate.crt'),
  key: fs.readFileSync(__dirname + '/certificate/lets-encrypt-private.pem'),
  cert: fs.readFileSync(__dirname + '/certificate/lets-encrypt-cert.pem'),
  spdy: {
    protocols: [ 'h2', 'http/1.1' ],
    plain: false,
  }
}, appH2);
serverH2.listen(appH2.get("port"), ()=> {
  console.log("Server HTTP/2 listening on port " + appH2.get("port"));
});

module.exports = app;
