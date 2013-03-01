var redis = require("redis"),
    client = redis.createClient(10265, 'dory.redistogo.com');

  client.auth('d5fc7a7f66d1091dc7829a502e6418a7');
  client.on("error", function (err) {
    console.log("Error " + err);
  });

var Redis = {};
module.exports = Redis;

Redis.storeHash = function (key, value) {
  client.set(key, value); // should check and handle errors
};

Redis.getId = function (key, callback) {
  client.get(key, function (err, value) {
    callback(value);
  });
};