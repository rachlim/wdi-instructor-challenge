// instantiate express.js. our base framework for the code
var express = require('express');
var app = express();

// instantiate node modules required in our server codes
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('./logger');

// middlewares. run one after another
// app.use(logger);
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes list
app.post('/', function(req, res) {
  var input = req.body;
  // if (! input.movie_name) res.status(400);
  res.sendStatus(201);
});

app.get('/movies/:id', function(req, res) {
  var id = req.params.id;
  console.log('id is: ' + id);
  // post to omdb api here for restful application
  res.sendStatus(200);
});

app.get('/favorites', function(req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function(req, res){
  if(!req.body.name || !req.body.oid){
    // add message upon errors
    res.status(400).json({
      Error: 'Bad Request.',
      Message: 'No oID input was given.'
    });

    return;
  }

  // check if existing movie is in the stored data
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

  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');

  // send only posted movie upon successful post
  res.send(req.body);
});

// new route to delete (unfavorite) a movie
app.delete('/favorites', function(req, res) {
  if(!req.body.name || !req.body.oid){
    // add message upon errors
    res.status(400).json({
      Error: 'Bad Request.',
      Message: 'No oID input was given.'
    });

    return;
  }

  // check if existing movie is in the stored data
  var data = JSON.parse(fs.readFileSync('./data.json'));
  for(var i = 0; i < data.length; i++) {
    var movie = data[i];

    console.log(movie.oid, req.body.oid);

    if(movie.oid !== req.body.oid) {
      res.status(400).json({
        Error: 'Bad Request.',
        Message: 'Existing movie has not been favorited before.'
      });

      return;
    } else {
      console.log('unfavor this movie');
      console.log(movie);
      removed_data = data.splice(i, 1);
      console.log(removed_data, data);
    }
  }

  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');

  // send only posted movie upon successful post
  res.send(req.body);
});

module.exports = app;
