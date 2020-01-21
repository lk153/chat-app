var app = require('express')();
const express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static('public'));

const PORT = 80;

const EVENT_CONNECT = "connect";
const EVENT_DISCONNECT = "disconnect";
const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_CHANGE_USER = "change-user";
const EVENT_REGISTER_USER = "register-user";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

io.on(EVENT_CONNECT, function(socket) {
    socket.username = "Anonymous";
    console.log('a user connected');

    socket.on(EVENT_CHAT_MESSAGE, function(msg) {
        msg.username = socket.username;
        io.emit(EVENT_CHAT_MESSAGE, msg);
    });

    socket.on(EVENT_DISCONNECT, function() {
        console.log('user disconnected');
    });

    socket.on(EVENT_REGISTER_USER, function(msg) {
        socket.username = msg.username;
        socket.broadcast.emit(EVENT_REGISTERED_USER, msg);
    });

    socket.on(EVENT_USER_TYPING, function() {
        socket.broadcast.emit(EVENT_USER_TYPING, {username: socket.username});
    });

    socket.on(EVENT_USER_TYPING_FOCUSOUT, function() {
        socket.broadcast.emit(EVENT_USER_TYPING_FOCUSOUT);
    });
});

http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});