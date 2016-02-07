var request = require('supertest');
var nock = require('nock'); // maybe redundant
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
      .expect('Content-Type', /html/, done);
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
      .expect('Content-Type', /json/, done);
  });
});

describe('Call OMDB api', function () {
  it('has movie keyword in the request', function (done) {
    var omdb = nock('http://www.omdbapi.com')
                .get('/?foo=Bar&r=json')
                .reply(200, {
                  Response: "False",
                  Error: "Something went wrong."
                });

    setTimeout(function() {
      omdb.done(); //
    }, 5000);
  });

  // it('Returns a 200 status code', function () {
  //   omdb.post('/')
  //     .send(params)
  //     .expect(200);
  // });
  //
  // it('Returns a JSON format', function (done) {
  //   omdb.post().send(params)
  //     .expect('Content-Type', /json/, done);
  // });
});
