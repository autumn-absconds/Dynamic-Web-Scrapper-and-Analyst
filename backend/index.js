const express = require('express');
const router = require('./router/router')
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));               //very imp for post request
server.use(bodyParser.json());

server.use(router);



server.listen(8000, () => {
  console.log('server started');
})


