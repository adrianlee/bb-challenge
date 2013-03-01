var express = require('express');
var neo = require('./lib/neo');
var app = express();

var redis = require('./lib/redis');
var async = require('async');
var _ = require('lodash');

// Express Middleware
app.use(express.bodyParser());

// Hello World
app.get('/', function (req, res) {
  res.send({ greeting: 'Hello World' });
});

// initialize
app.get('/init1', function (req, res) {
  neo.populateDB();
  res.send(200);
});

// setRelationships
app.get('/init2', function (req, res) {
  neo.setRelationships();
  res.send(200);
});


// Search
app.get('/search', function (req, res) {
  var payload = [];

  if (req.param("to") == req.param("from")) {
    return res.send("Don't be silly");
  }

  if (!req.param("to") || !req.param("from")) {
    return res.send("Invalid Query");
  }

  // Get Ids
  async.parallel({
    to: function (callback) {
      redis.getId(req.param("to"), function (id) {
        neo.retrieveNodeById(id, function (err, node) {
          if (err) return callback(err);
          callback(null, node);
        });
      });
    },
    from: function (callback) {
      redis.getId(req.param("from"), function (id) {
        neo.retrieveNodeById(id, function (err, node) {
        if (err) return callback(err);
          callback(null, node);
        });
      });
    }
  }, function (err, results) {
    if (err) {
      return res.send(err);
    }

    results.from.path(results.to, 'routes', 'out', 99, 'shortestPath', function (err, path) {
      var duration = 0;
      var price = 0;

      var tasks = [];

      // Display Path
      console.log("Path Taken: ")
      _.forEach(path.nodes, function (node) {
        console.log(node.id);
      });

      // Queue tasks of retreieving each relationship and calc price & duration
      _.forEach(path.relationships, function (rel) {
        // Can't access data property from rel. so retrieve from db.

        tasks.push(function (callback) {
          neo.retrieveRelationshipById(rel.id, function (err, rel) {
            duration += rel.data.duration;
            price += rel.data.price;
            callback(null);
          });
        })
      });

      // Exec tasks
      async.parallel(tasks, function (err, results) {
        payload.push({ from: req.param("from"), to: req.param("to"), duration: duration });
        res.send(payload);
      });
    });
  });

});

app.listen(3000);
console.log('Listening on port 3000');

process.on('uncaughtException', function (err) {
  console.log("uncaughtException:");
  console.log(err);
});