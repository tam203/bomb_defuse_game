const path = require('path');
const request = require('request');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var staticDir = path.resolve(path.join(__dirname, '/../../dist/static'));

var proxy = require('express-http-proxy');



var bomb_url = (process.env.bomb_url)? process.env.bomb_url : 'http://localhost:3300/';
app.use('/stats/', proxy(bomb_url));




console.log('Serving static from', staticDir);
app.use(express.static(staticDir));

app.use('/start', function(req, res, next) {
    console.log(req.query);
    var teamCode = req.query.teamCode.replace('/','__').replace('\\','--');
    request('http://localhost:3300/teamProgress/' + teamCode, function (error, response, body) {
        if(error){
            console.log("Error starting team", error);
            res.status(500).send('Something broke!');
        } else {
             res.redirect('/?teamCode='+teamCode+'&tool=chat');
        }

    });
})


io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

});

io.on("connection", function (socket) {

    var self = this;

    socket.on("register", function(msg) {
        self.code = msg.code;
        console.log("Joined %s", self.code);
        socket.join(self.code);
    });

    socket.on("disconnect", function () {
        socket.leave(self.code);
    });

    socket.on("msg", function(msg) {
        console.log('got a message!');
        io.in(self.code).emit("msg", msg);
    });

});



server.listen(3000);
