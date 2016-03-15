// instantiate express.js. our base framework for the code
var express = require('express');
var app = express();

// instantiate node modules required in our server codes
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('./logger');

// middlewares. run one after another
// app.use(logger); //custom middleware made for debugging purposes
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// this part here is to sync the express framework with the static files inside public folder

// routes list
// unused route, commented just in case
// app.post('/', function(req, res) {
//   var input = req.body;
//   res.sendStatus(201);
// });

// unused route, just in case want to extend the site to have
// a specific page for each movie
app.get('/movies/:id', function(req, res) {
  var id = req.params.id;
  console.log('id is: ' + id);
  // post to omdb api here for restful application
  res.sendStatus(200);
});

/* ROUTES FOR FAVORITE API CREATE, UPDATE, AND DELETE */
app.get('/favorites', function(req, res) {
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data = data.reverse();
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function(req, res){

  // check request parameter if has an input named "oid",
  // if not exist, return 400 error status code
  if(!req.body.name || !req.body.oid){
    // add message upon errors
    res.status(400).json({
      Error: 'Bad Request.',
      Message: 'No oID input was given.'
    });

    return;
  }

  // check if existing movie is in the stored data
  // if it is, return 400 error status codes to avoid duplication in the data
  var data = JSON.parse(fs.readFileSync('./data.json'));
  for(var i = 0; i < data.length; i++) {
    var movie = data[i];

    if(movie.oid === req.body.oid) {
      res.status(400).json({
        Error: 'Bad Request.',
        Message: 'Existing movie has been favorited before.'
      });

      return;
    }
  }

  // if no same data found inside the json file
  // write into the json file
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');

  // send only posted movie as a response
  res.send(req.body);
});

// new route to delete (unfavorite) a movie
app.delete('/favorites', function(req, res) {

  // same validation as per previous api call
  if(!req.body.oid){
    // add message upon errors
    res.status(400).json({
      Error: 'Bad Request.',
      Message: 'No oID input was given.'
    });

    return;
  }

  // check if existing movie is in the stored data
  // same like previous
  var data = JSON.parse(fs.readFileSync('./data.json'));
  var deleteID = false; //decouple the condition with the writing process. for sanity purposes

  for(var i = 0; i < data.length; i++) {
    var movie = data[i];

    if(movie.oid === req.body.oid) {
      deleteID = true;
      data.splice(i, 1); // remove only the json object that is equal to the requested parameter
      fs.writeFile('./data.json', JSON.stringify(data));
    }
  }

  if (deleteID) {
    res.setHeader('Content-Type', 'application/json');
    // send only deleted movie as a response
    res.send(req.body);
  } else {
    res.status(400).json({
      Error: 'Bad Request.',
      Message: 'Existing movie has not been favorited before.'
    });

    return ;
  }
});

// exported the main app modules
// network is binded on a different file so the app can be tested by test.js
module.exports = app;
