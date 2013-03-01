var express = require('express');
var neo = require('./lib/neo');
var app = express();

// Express Middleware
app.use(express.bodyParser());

// Hello World
app.get('/', function (req, res) {
  res.send({ greeting: 'Hello World' });
});

// Init
app.get('/init', function (req, res) {
  neo.createOne(function () {
    res.send(200);
  });
});

// Search
app.get('/search', function (req, res) {
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