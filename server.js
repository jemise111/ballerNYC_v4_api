var express = require('express');
var config = require('./config');
var db = require('./db/db');

// setup

var app = express();
var port = process.env.PORT || config.port;

// routes

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/courts', function(req, res){
  var courts = db.getCollectionData('courts', function(data){
    var formattedData = formatCourtsData(data);
    res.json(formattedData);
  });
});

// helper

function formatCourtsData(courts) {
  var data = {
    courts: {},
    boroughs: []
  };
  for (var i = 0; i < courts.length; i++) {
    var borough = courts[i].borough;
    if (data.boroughs.indexOf(borough) === -1) {
      data.courts[courts[i].borough] = [];
      data.boroughs.push(borough);
    }
    data.courts[borough].push(courts[i]);
  }
  return data;
}

// start the server

var port = config.server.port;
app.listen(port);
console.log('Started server on port: ' + port);
