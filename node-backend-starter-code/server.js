/* 

I ♥ Movies Server
==========
Jeremiah Alexander

*/

//load env vars only on devlopment, not needed on heroku
var env = process.env.NODE_ENV || "dev";
if ( env === "dev" ){
  require('dotenv').config();
}

//setup requirements
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require("body-parser");
var uuidGenerator = require('node-uuid');
var db = require("./db");
var Movie = require("./models/movie.js");

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

//we expect a uuid, so that we can return the correct favs for the current user
app.get('/favorites/:uuid', function(req, res){
  res.setHeader('Content-Type', 'application/json');

  if ( !req.params.uuid ){
    return res.send({success: false, Error: "Invalid UUID provided."}); 
  }

  //find all movies stored with this uuid and sort by imdbID
  Movie.find( { uuid: req.params.uuid }, function(err, movies){
    if (err){
      res.status(500).json({status: "failure"} ); 
    } else {
      res.json( {success: true, movies: movies } );
    }
  }).setOptions({sort: "imdbID"});
});

//POST a new fav to the list, create a uuid if one is note provided
app.post('/favorites', function(req, res){
  res.setHeader('Content-Type', 'application/json');

  //if we don't have a uuid we generate one
  var newUser = false;
  var uuid = req.body.uuid;
  //simply validation on the uuid by checking for a minimum length
  if ( !uuid || uuid.length < 36) {
    newUser = true;
    uuid = uuidGenerator.v1();
  }

  //have we got a title and imdbID
  if ( !req.body.imdbID || !req.body.title ){
    return res.status(422).json({status: "Invalid data provided."} ); 
  }

  //check if we have already hearted this record for this user
  Movie.find( { uuid: uuid, imdbID: req.body.imdbID }, function(err, movies){
    if (err){
      res.status(500).json( {status: "failure"} ); 
    } else {
      
      if ( movies.length === 0 ) {
        //if not we create a new movie record and save it to the database
        var record = new Movie();
        record.imdbID = req.body.imdbID;
        record.title = req.body.title;
        record.uuid = uuid;

        record.save(function(err){
          if (err){
            res.status(500).json({status: "failure"} ); 
          } else {
            res.json( {success: true, uuid: uuid, movie_id: record._id  } );
          }
        });
      } else {
        res.json( {success: true, uuid: uuid, movie_id: movies[0]._id } );
      }
    }
  });
});

//Added a delete route for removing favs by mongodb oid
app.delete("/favorites/:oid", function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  Movie.remove( { _id: req.params.oid }, function(err, movie) {
    if (err){
      res.status(422).json({status: "Failed to unheart Movie"} ); 
    } else {
      res.json( {success: true, message: "Movie unhearted" } );
    }
  });
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});

//export the module so we can use it for testing
module.exports = app;