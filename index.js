import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import SocketCL from './socket.js';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
(new SocketCL(io));

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
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

server.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});