var https = require('https');
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

app.get('/search', function(mainRequest, mainResponse){
	var address = mainRequest.query.address;
	var geocodeUrl = config.geocode.url + '&address=' + address;
	https.get(geocodeUrl, function(googleResponse) {
		var body = '';
    googleResponse.on('data', function(chunk){
        body += chunk;
    });
    googleResponse.on('end', function(){
    	var responseBody = JSON.parse(body);
    	if (responseBody.results.length) {
    		var lat = responseBody.results[0].geometry.location.lat;
    		var lon = responseBody.results[0].geometry.location.lng;
				var maxDistance = 500;
				var options = formatter.formatLatLonIntoOptions(lat, lon, maxDistance);

			  var courts = db.getCollectionData('courts', options, function(data){
			    mainResponse.json(data);
			  });
    	} else {
    		mainResponse.json({message: 'No results found'});
    	}
    });
	});
});

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
