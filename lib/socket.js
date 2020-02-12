import ChatModel from './model/ChatModel.js';

const EVENT_SOCKET_CONNECT = "connect";
const EVENT_DISCONNECT = "disconnect";
const EVENT_SOCKET_RECONNECT = "reconnect";

const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_USER_ONLINE = "user-online";
const EVENT_USER_OFFLINE = "user-offline";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";
const EVENT_USER_JOIN_ROOM = "user-join-room";

const CHAT_NAMESPACE = "admin";

export default class SocketCL {
    constructor(io) {
        const nameSpaceChat = io.of(`/${CHAT_NAMESPACE}`);
        nameSpaceChat.on(EVENT_SOCKET_CONNECT, function(socket) {

            //User join room
            socket.on(EVENT_USER_JOIN_ROOM, (msg, cb) => {
                socket.username = msg.username;
                socket.gender = msg.gender;

                let currentRooms = Object.keys(socket.rooms);
                if (msg.username && msg.room) {
                    if (currentRooms.length == 2) {
                        //In case, Already in room
                        socket.leave(currentRooms[1], () => {
                            console.log("Leave " + JSON.stringify(socket.rooms));
                            socket.join(msg.room, () => {
                                console.log("Join " + JSON.stringify(socket.rooms));
                            });
                        });
                    } else {
                        //In case, Not join any room
                        socket.join(msg.room, () => {
                            console.log("Join " + JSON.stringify(socket.rooms));
                        });
                    }
                    cb(true);
                }
            });

            //User register account
            socket.on(EVENT_USER_ONLINE, (msg, cb) => {
                if (msg.room) {
                    socket.join(msg.room, () => {
                        console.log("Join default: " + JSON.stringify(socket.rooms));
                    });
                }

                socket.username = msg.username;
                socket.gender = msg.gender;
                socket.broadcast.emit(EVENT_REGISTERED_USER, msg);
                cb(true);
            });

            //User chat message
            socket.on(EVENT_CHAT_MESSAGE, function(msg) {
                nameSpaceChat.in(msg.room).emit(EVENT_CHAT_MESSAGE, msg);
                const chatObj = new ChatModel();
                chatObj.insertDocuments('message', [{
                    'username': msg.username,
                    'message': msg.message,
                    'room': msg.room,
                    'namespace': CHAT_NAMESPACE,
                    'time': msg.time,
                }]);
            });

            //User 's typing
            socket.on(EVENT_USER_TYPING, function(msg) {
                socket.username = msg.username;
                socket.to(msg.room).emit(EVENT_USER_TYPING, {
                    username: msg.username
                });
            });

            //User stop typing
            socket.on(EVENT_USER_TYPING_FOCUSOUT, function(msg) {
                socket.to(msg.room).emit(EVENT_USER_TYPING_FOCUSOUT);
            });

            //User logout
            socket.on(EVENT_DISCONNECT, function() {
                nameSpaceChat.emit(EVENT_USER_OFFLINE, {
                    username: socket.username,
                    gender: socket.gender
                });
                console.log('User disconnected');
            });
        });
    }
}