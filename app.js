var express = require('express');
var app = express();

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://2be69f6fc:939366037@ec9a7c4ee.hosted.neo4j.org:7355');

app.use(express.bodyParser());

// Hello World
app.get('/', function(req, res) {
  res.send({ greeting: 'Hello World' });
});

// Init
app.get('/init', function(req, res) {
  var node = db.createNode({hello: 'world'});
  node.save(function (err, node) {
      if (err) {
          console.err('Error saving new node to database:', err);
      } else {
          console.log('Node saved to database with id:', node.id);
      }
  });
  res.send(200);
});

// Search
app.get('/search', function(req, res) {
  var payload = [];

  if (!req.param("to") || !req.param("from")) {
    return res.send("Invalid Query")
  }

  console.log(req.param("to"));
  console.log(req.param("from"));

  payload.push({ to: req.param("to"), from: req.param("from"), duration: 0 });

  res.send(payload);
});

app.listen(3000);
console.log('Listening on port 3000');