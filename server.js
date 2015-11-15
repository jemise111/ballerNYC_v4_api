var express = require('express');
var cors = require('cors');
var config = require('./config');
var db = require('./db/db');
var formatter = require('./helpers/dataFormatter');

// setup

var app = express();
var port = process.env.PORT || config.port;
app.use(cors());

// routes

app.get('/courts', function(req, res){
  var options = formatter.formatQueryIntoOptions(req.query);
  var courts = db.getCollectionData('courts', options, function(data){
    res.json(data);
  });
});

app.get('/', function(req, res){
  var courts = db.getCollectionData('courts', function(data){
    res.send('Successfully connected');
  });
});

app.use(function(req, res) {
   res.send('404: Page not Found', 404);
});

// start the server

var port = config.server.port;
app.listen(port);
console.log('Started server on port: ' + port);
