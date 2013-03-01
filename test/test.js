var should = require("should");
var sinon = require('sinon'); // for spies/mocks
var request = require('request');

var app = require('../app');

before(function (done) {
  setTimeout(function() {
    // Wait for server to start
    done();
  }, 1500);
});

describe('Enpoints', function() {

  describe('index', function() {
    it('should return hello world', function() {
      request.get({ url: 'http://localhost:3000/', json: true }, function (err, res, body) {
        body.greeting.should.equal("Hello World");
      });
    })
  })

  describe('search', function() {
    it('should return Invalid Query for undefined params', function() {
      request.get({ url: 'http://localhost:3000/search', json: true }, function (err, res, body) {

      });
    })

    it('should return Invalid Query for unknown params', function() {
      request.get({ url: 'http://localhost:3000/search', json: true }, function (err, res, body) {

      });
    })

    it('should return proper payload for valid params', function() {
      request.get({ url: 'http://localhost:3000/search', json: true }, function (err, res, body) {

      });
    })
  })
})
