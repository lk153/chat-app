import ChatModel from './model/ChatModel.js';

const EVENT_CONNECT = "connect";
const EVENT_DISCONNECT = "disconnect";
const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_REGISTER_USER = "register-user";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";
const EVENT_CHANGE_USER = "change-user";

export default class SocketCL {
    constructor(io) {
        io.on(EVENT_CONNECT, function (socket) {

            //User register account
            socket.on(EVENT_REGISTER_USER, function (msg) {
                socket.broadcast.emit(EVENT_REGISTERED_USER, msg);
            });

            //User chat message
            socket.on(EVENT_CHAT_MESSAGE, function (msg) {
                io.emit(EVENT_CHAT_MESSAGE, msg);
                const chatObj = new ChatModel();
                chatObj.insertDocuments('message', [
                    { 'user': msg.username, 'content': msg.message }
                ]);
            });

            //User 's typing 
            socket.on(EVENT_USER_TYPING, function (msg) {
                socket.broadcast.emit(EVENT_USER_TYPING, { username: msg.username });
            });

            //User stop typing
            socket.on(EVENT_USER_TYPING_FOCUSOUT, function () {
                socket.broadcast.emit(EVENT_USER_TYPING_FOCUSOUT);
            });

            //User logout
            socket.on(EVENT_DISCONNECT, function () {
                console.log('User disconnected');
            });

        });
    }
}