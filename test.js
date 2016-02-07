var request = require('supertest');
var app = require('./app');

describe('Request to the root path', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns a HTML format', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=UTF-8', done);
  });
});

describe('Request to the favorite path', function () {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/favorites')
      .expect(200, done);
  });

  it('Returns a JSON format', function (done) {
    request(app)
      .get('/favorites')
      .expect('Content-Type', 'application/json', done);
  });
});
