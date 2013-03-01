var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://2be69f6fc:939366037@ec9a7c4ee.hosted.neo4j.org:7355');

var async = require('async');
var _ = require('lodash');

var redis = require('./redis');

var segments = require('../data/segments.json');
var locations = require('../data/locations.json');

var neo = {};
module.exports = neo;

neo.retrieveById = function (id, callback) {
  db.getNodeById(id, function (err, node) {
    if (err) return callback(err);
    callback(null, node);
  });
};

// Neo4J stores IDs via integers
// http://coffeedoc.info/github/thingdom/node-neo4j/master/#getNodeById
neo.populateDB = function (callback) {
  console.log("Populating...");

  _.forOwn(locations, function (value, key) {
    // e.g.
    // key: 375dd5879001acbd84a4683ded8caffa
    // value: { city: 'Praia Sêca', country: 'Brazil', region: 'Rio de Janeiro' }
    location = _.merge({'id': key }, value);

    // Create noe4j node
    createNode(location, function (err, id) {
      // Create hash-id mapping
      redis.storeHash(key, id);
    });
  });
};

// Set Relationships
neo.setRelationships = function (callback) {
  console.log("Setting Relationships...");

  _.forOwn(locations, function (value, key) {
    // Get all routes from location
    var routes = _.where(segments, { 'from': key });

    // Get from's id
    redis.getId(key, function (id) {
      // Get from's node neo4j object
      db.getNodeById(id, function (err, from) {
        // For each route, set relationship
        _.forEach(routes, function(segment) {
          var obj = _.omit(segment, ['to', 'from']);

          // Get to's id
          redis.getId(segment.to, function (id) {
            // Get to's node neo4j object
            db.getNodeById(id, function (err, to) {
              // Set route relationship
              from.createRelationshipTo(to, 'routes', obj);
            });
          });
        });
      });
    });
  });
};

function createNode(data, callback) {
  var node = db.createNode(data);

  node.save(function (err, node) {
    if (err) {
      console.log('Error saving new node to database:', err);
    } else {
      console.log('Node saved to database with id:', node.id);
      callback(null, node.id);
    }
  });
}

// Test
neo.test = function (callback) {
  var _self = this;
  var node = db.createNode({id: '375dd5879001acbd84a4683dedaea60e', "city": "Buenos Aires", "country": "Argentina", "region": "Buenos Aires F.D."});

  node.save(function (err, node) {
      if (err) {
          console.log('Error saving new node to database:', err);
      } else {
          console.log('Node saved to database with id:', node.id);
          callback(node.id);
          _self.retrieveById(123, function (err, to) {
            var rel = node.createRelationshipTo(to, 'routes', {}, function (err, r) {
              console.log(err);
              console.log(r);
            });
          });
      }
  });
};
