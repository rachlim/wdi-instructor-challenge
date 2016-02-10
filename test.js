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

describe('Request to favorite a movie', function () {
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

  it('Returns error without oID', function (done) {
    request(app)
      .post('/favorites')
      .expect(400, {
        Error: 'Bad Request.',
        Message: 'No oID input was given.'
      }, done);
  });

  it('Returns error when posted an existing oID ', function (done) {
    request(app)
      .post('/favorites')
      .send('name=Foo&oid=Bar')
      .expect(400, {
        Error: 'Bad Request.',
        Message: 'Existing movie has been favorited before.'
      }, done);
  });

  it('Returns posted data if posted correctly', function (done) {
    var rand_name = Math.random().toString(36).substring(7),
        rand_oid = Math.random().toString(36).substring(7);

    request(app)
      .post('/favorites')
      .send('name='+rand_name+'&oid='+rand_oid)
      .expect(200, {
        name: rand_name,
        oid: rand_oid
      }, done);
  });
});

describe('Request to remove favorite from movie', function () {
  it('Returns a JSON format', function (done) {
    request(app)
      .delete('/favorites')
      .expect('Content-Type', /json/, done);
  });

  it('Delete without oID return error', function (done) {
    request(app)
      .delete('/favorites')
      .expect(400, {
        Error: 'Bad Request.',
        Message: 'No oID input was given.'
      }, done);
  });

  it('Delete a non existent oID returns error', function (done) {
    request(app)
      .delete('/favorites')
      .send('name=Bar&oid=Foo')
      .expect(400, {
        Error: 'Bad Request.',
        Message: 'Existing movie has not been favorited before.'
      }, done);
  });

  it('Returns requested body when successful', function (done) {
    request(app)
      .delete('/favorites')
      .send('name=Here+Comes+the+Boom&oid=tt1648179')
      .expect(200, {
        name: 'Here Comes the Boom',
        oid: 'tt1648179'
      }, done);
  });
});
