var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

var database;

module.exports.connect = function(cb) {
  if (database) {
    if (cb) { cb(database); }
  } else {
    MongoClient.connect(config.db.url, function(err, db){
      database = db;
      if (cb) { cb(db); }
    });
  }
}

module.exports.addToCollection = function(name, arrayOfObjs) {
  this.connect(function(db){
    var collection = db.collection(name);
    arrayOfObjs.map(function(o) {
      collection.insert(o, function(){});
    });
  });
}

module.exports.validateAddCourts = function(courtsArray) {
  this.connect(function(db){
    var courtsCollection = db.collection('courts');
    for (var i = 0; i < courtsArray.length; i++) {
      var testId = courtsArray[i].Prop_ID;
      // TODO: implement functionality to conditionally upsert courts
    }
    courtsCollection.find({})
  });
}

module.exports.getCollectionData = function(name, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  this.connect(function(db){
    var collection = db.collection(name);
    collection.find(options.query)
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .toArray(function(err, docs) {
      cb(docs);
    });
  });
}
