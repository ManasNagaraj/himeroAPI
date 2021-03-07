'use strict';
const express = require('express');
const EventEmitter = require('events');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

// Create the express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const emitter = new EventEmitter();
const server = http.createServer(app);

//**************************************************** */
//socket

const WebSocket = require('ws');
const { res } = require('pino-std-serializers');
const s = new WebSocket.Server({ server });

//************************************************************ */
s.on('connection', function (ws, req) {
  /******* when server receives messsage from client trigger function with argument message *****/
  ws.on('message', function (message) {
    console.log('Received: ' + message);
  });
  var listner1 = function listner1(status) {
    console.log(`listner1 executed ${status}`);
    ws.send('From Server only to sender: ' + status);
  };

  emitter.on('status', listner1);
  ws.on('close', function () {
    console.log('lost one client');
  });
  //ws.send("new client connected");
  console.log('new client connected');
});
//send data to esp

// Routes and middleware
app.get('/device', (req, res) => {
  try {
    emitter.emit('status', req.body);
    res.status(200).json({ success: 'true' });
  } catch (err) {
    console.log(err);
    res.status(500).send('interal server error');
  }
});

// Start server
server.listen(5000, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log('Started at http://localhost:5000');
});
