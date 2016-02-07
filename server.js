// instantiate express.js. our base framework for the code
var express = require('express');
var app = express();

// instantiate node modules required in our server codes
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('./logger');

// middlewares. run one after another
app.use(logger);
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes list
// final middleware that ties in the static view files
app.use('/', express.static( path.join(__dirname, 'public') ) );

app.post('/', function(req, res) {
  var request_body = req.body;

  console.log(request_body);
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

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
