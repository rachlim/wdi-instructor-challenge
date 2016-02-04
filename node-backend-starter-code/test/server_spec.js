/* 

I ♥ Movies Tests
==========
Jeremiah Alexander

Some very basic tests to ensure that the end points are working. Currently using the db would be better to rewire the data 

*/

var expect = require('chai').expect;
var server = require('../server');
var request = require('supertest');

describe("Movies App", function(){
	
	//running locally can be slow so set a high time out
	this.timeout(10000);
	
	it("loads the home page", function(done){
		request(server).get("/").expect(200).end(done);
	});

	describe("Movies API", function(){

		describe("GETS Favorite", function(){
			it("should return an array of favourited movies for the specified user", function(done){

				request(server).get("/favorites/28ced7a0-c755-11e5-9150-5f881668e7fe").expect(200).end(function(err,res){
					var result = JSON.parse(res.text);
					console.log(result.movies);
					expect(result.success).to.equal(true);
					done();
				});
			});
		});
		describe("POST Favorite", function(){

			it("should add a favorite and return a uuid", function(done){

				request(server).post("/favorites")
					.send({ imdbID: "1234", title: "Fake Move"}).expect(200).end(function(err,res){
						var results = JSON.parse(res.text);
						expect(results.success).to.equal(true);
						expect(results.movie_id.length).to.be.above(0);
						expect(results.uuid.length).to.be.above(35);
						done();
					});
			});
		});

		describe("DELETE Favorite", function(){

			it("should return unprocessable if nonexistant id is passed", function(done){
				request(server).delete("/favorites/fake12345id").expect(422).end(done);
			});
		});
	});

});