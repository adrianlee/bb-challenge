var express = require('express');
var app = express();

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://2be69f6fc:939366037@ec9a7c4ee.hosted.neo4j.org:7355/db/data/');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.listen(3000);
console.log('Listening on port 3000');