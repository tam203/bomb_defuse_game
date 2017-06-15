const safeTeamId = require('./utils').safeTeamId;
const JsonDB = require('node-json-db');
const path = require('path');

var db = new JsonDB("players", true, false);
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var staticDir = path.resolve(path.join(__dirname, './static'));
console.log('Serving static from', staticDir);
app.use(express.static(staticDir));

app.use('/teamProgress/:id', function(req, res, next) {
  var team = safeTeamId(req.params.id);
  var path = '/teams/' + team;
  var currentRecord = {};
  try { // get the team data
    currentRecord = db.getData(path);
  } catch(error) {
    currentRecord = {name:team, startAt: (new Date()).getTime(), state:"playing"}
    db.push(path, currentRecord);
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(currentRecord));
});

server.listen(3300);
