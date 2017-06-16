const safeTeamId = require('./utils').safeTeamId;
const stats = require('./stats');
const path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var engine = require('express-dot-engine');
var bodyParser = require('body-parser')


app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './templates'));
app.set('view engine', 'dot');

app.use(bodyParser.urlencoded({
  extended: true
}));

// Pages
app.get('/', function(req, res, next){
  var teamCode = req.query.teamCode;
  console.log(teamCode);
  res.render('bomb',{teamCode:(teamCode)?teamCode:""});
});

app.get('/bang', function(req, res, next) {
  var msg = req.query.msg;
  res.render('bang',{msg:msg});
});

app.get('/win', function(req, res, next) {
  res.render('win');
});

// API
app.get('/teamProgress/:id', function(req, res, next) {
  var team = safeTeamId(req.params.id);
  var teamStats = stats.getOrCreate(team);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(teamStats));
});


app.post('/defuse', function(req, res, next) {
  var teamCode = req.body.teamCode;
  try {
    var teamStats = stats.get(teamCode);
  } catch (e){
    res.status(500).send("Can not find the team " + teamCode + ". Please start again with a valid team code.");
    return;
  }
  // TODO: make sure that time to complete is set globbally accross app.
  if(((new Date()).getTime() - teamStats.startAt) > 60 * 60 * 1000){
    teamStats.state = 'lost';
    teamStats.stateReason = 'slow';
    stats.update(teamCode, teamStats);
    res.redirect("/bang?msg=to%20slow");
    return;
  }
  if(teamStats.defuseAttempts >= 3){
    // to many trys
    teamStats.state = 'lost';
    teamStats.stateReason = 'to many trys';
    stats.update(teamCode, teamStats);
    res.redirect("/bang?msg=to%20many%20attempts");
    return;
  }

  console.log(req.body);
  if(
      req.body.code0 === '0' &&
      req.body.code1 === '1' &&
      req.body.code2 === '2' &&
      req.body.code3 === '3' &&
      req.body.code4 === '4' &&
      req.body.code5 === '5'
    )
    {
      console.log("team ", teamCode, "has won");
      teamStats.state = 'won';
      teamStats.stateReason = 'defuse at ' + (new Date()).getTime();
      stats.update(teamCode, teamStats);
      res.redirect("/win");
      return
    } else {
      teamStats.defuseAttempts = (teamStats.defuseAttempts)? teamStats.defuseAttempts + 1 : 1;
      stats.update(teamCode, teamStats);
      if(teamStats.defuseAttempts >= 3){
        teamStats.state = 'lost';
        teamStats.stateReason = 'to many trys';
        stats.update(teamCode, teamStats);
        res.redirect("/bang?msg=to%20many%20attempts");
      } else {
        res.redirect("/?teamCode="+teamCode);
      }
    }
});

server.listen(3300);
