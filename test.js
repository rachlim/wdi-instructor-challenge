var request = require('supertest');
var nock = require('nock'); // maybe redundant
var app = require('./app');

// var omdb = request('http://www.omdbapi.com/');
var params = {t: 'Star Wars', r: 'json'};

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
  it('has movie_name in the request', function () {
    var omdb = nock('http://www.omdbapi.com/')
                .get(params)
                .reply(404);
    // omdb.post('/')
    //   .send({foo: 'bar'})
    //   .expect({
    //     Response: "False",
    //     Error: "Something went wrong."
    //   }, done);

    // request(app)
    //   .get('/?tags=california&tagmode=all')
    //   .expect(200, done);
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
