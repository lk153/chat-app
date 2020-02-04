import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import SocketCL from './socket.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
(new SocketCL(io));

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '../public/index.html');
});
app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/public/chat.html');
});

server.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});

export default server;