// app.js
const path = require('path');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var staticDir = path.resolve(path.join(__dirname, './static'));
console.log('Serving static from', staticDir);
app.use(express.static(staticDir));

app.use('/teamProgress/:id', function(req, res, next) {
  var team = req.params.id;
  res.write('hi');

  
});

server.listen(3300);
