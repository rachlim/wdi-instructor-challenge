var request = require('supertest');
var app = require('./app');
var omdb = 'http://www.omdbapi.com';

describe('Request to the root path', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns a HTML format', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });
});

describe('Request to the favorite path', function () {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns a JSON format', function (done) {
    request(app)
      .get('/favorites')
      .expect('Content-Type', /json/, done);
  });
});

describe('Call OMDB SEARCH api', function () {

  it('Returns a 200 status code', function (done) {
    request(omdb)
      .get('/?foo=Bar&r=json')
      .expect(200, done);
  });

  it('Returns a JSON format', function (done) {
    request(omdb)
      .get('/?foo=Bar&r=json')
      .expect('Content-Type', /json/, done);
  });

  it('must have search keyword in the request', function (done) {
    request(omdb)
      .get('/?foo=Bar&r=json')
      .expect({
        Response: "False",
        Error: "Something went wrong."
      }, done);
  });

  it('result search keyword in the request', function (done) {
    request(omdb)
      .get('/?s=lolz&r=json&t=movie')
      .expect({
        Response: "False",
        Error: "Movie not found!"
      }, done);
  });
});

describe('Call OMDB DETAILS api', function () {
  
});
