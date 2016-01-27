// Modules
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public'))); // serve static files from public
app.use(bodyParser.urlencoded({ extended: false })); // parse form data
app.use(bodyParser.json()); // parse JSON

// Serve homepage from public folder
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/favorites', function (req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorites', function (req, res) {
  // Request must have "name" and "oid" fields
  if (!req.body.name || !req.body.oid) {
    res.send("Error");
    return;
  }

  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Start server and listen to port - get port from environment if available, eg. if deployed on Heroku
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
