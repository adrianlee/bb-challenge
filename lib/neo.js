var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://2be69f6fc:939366037@ec9a7c4ee.hosted.neo4j.org:7355');

var neo = {};
module.exports = neo;

neo.createOne = function (callback) {
  var node = db.createNode({hello: 'world'});
  node.save(function (err, node) {
      if (err) {
          console.err('Error saving new node to database:', err);
      } else {
          console.log('Node saved to database with id:', node.id);
          callback(node.id);
      }
  });
};