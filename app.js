var express = require('express');
var neo = require('./lib/neo');
var app = express();

var redis = require('./lib/redis');
var async = require('async');

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

  if (!req.param("to") || !req.param("from")) {
    return res.send("Invalid Query")
  }

  // Get Ids
  async.parallel({
    to: function (cb) {
      redis.getId(req.param("to"), function (r) {
        cb(null, r);
      });
    },
    from: function (cb) {
      redis.getId(req.param("from"), function (r) {
        cb(null, r);
      });
    }
  }, function (err, results) {
    console.log(results);

    // retrieve node
    neo.retrieveById(results.to, function (err, node) {
      if (err) return console.log(err);
      console.dir(node.data);
    });

    neo.retrieveById(results.from, function (err, node) {
      if (err) return console.log(err);
      console.dir(node.data);
    });

    payload.push({ to: req.param("to"), from: req.param("from"), duration: 0 });
    res.send(payload);
  });

});

app.listen(3000);
console.log('Listening on port 3000');

process.on('uncaughtException', function (err) {
  console.log("uncaughtException:");
  console.log(err);
});