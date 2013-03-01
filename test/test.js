var should = require("should");
var sinon = require('sinon'); // for spies/mocks
var request = require('request');

var app = require('../app');

before(function (done) {
  setTimeout(function() {
    // Wait for server to start
    done();
  }, 1000);
});

describe('Enpoints', function() {

  describe('index', function() {
    it('should return hello world', function() {
      request.get({ url: 'http://localhost:3000/', json: true }, function (err, res, body) {
        console.log(err);
        body.greeting.should.equal("Hello World");
      })
    })
  })

  describe('search', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    })
  })
})
