var http = require('http');
var config = require('../config');
var parseString = require('xml2js').parseString;
var db = require('./db');

var COURTDATAPATH = "http://www.nycgovparks.org/bigapps/DPR_Basketball_001.xml";
var boroughMap = {
  'X': 'Bronx',
  'B': 'Brooklyn',
  'M': 'Manhattan',
  'Q': 'Queens',
  'R': 'Staten Island',
}

function getJSON(xmlString) {
  var json;
  parseString(xmlString, function (err, result) {
    if (err) {
      console.log('Error parsing xml', err);
      return;
    }
    json = result;
  });
  return json;
}

function format(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var thisObj = {};

    for (var k in array[i]) {
      // downcase all property names and remove arrays
      thisObj[k.toLowerCase()] = array[i][k][0];
    }

    if (thisObj.lat.length && thisObj.lon.length) {
      // add borough property
      thisObj.borough = boroughMap[thisObj.prop_id[0]];
      // add mongo geospacial property
      thisObj.loc = {
        type: 'Point',
        coordinates: [parseFloat(thisObj.lon), parseFloat(thisObj.lat)]
      }

      result.push(thisObj);
    }
  }
  return result;
}

function runSeed(courtsArray) {
  console.log("adding to db\n==========================");
  db.addToCollection('courts', courtsArray);
}

// Running Code
// ============

http.get(COURTDATAPATH, function(res) {
  console.log("fetching data\n==========================");
  var xml = '';
  res.on('data', function(chunk) {
    xml += chunk;
  });

  res.on('end', function() {
    console.log("parsing xml\n==========================");
    var data = getJSON(xml);
    var courtsArray = format(data.basketball.facility);
    runSeed(courtsArray);
  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
