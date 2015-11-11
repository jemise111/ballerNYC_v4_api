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
  return array.map(function(obj){
    for (var k in obj) {
      if (obj.hasOwnProperty(k)){
        obj[k] = obj[k][0];
      }
    }
    obj.borough = boroughMap[obj.Prop_ID[0]];
    return obj;
  })
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
