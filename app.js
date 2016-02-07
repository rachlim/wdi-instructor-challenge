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

app.get('/favorites', function(req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('favorites', function(req, res){
  if(!req.body.name || !req.body.oid){
    res.send("Error");
    return;
  }

  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

module.exports = app;
