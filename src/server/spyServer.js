// app.js
const path = require('path');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var staticDir = path.resolve(path.join(__dirname, '/../../dist/'));
console.log('Serving static from', staticDir);
app.use(express.static(staticDir));


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
