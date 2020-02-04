import ChatModel from './ChatModel.js';

const EVENT_CONNECT = "connect";
const EVENT_DISCONNECT = "disconnect";
const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_CHANGE_USER = "change-user";
const EVENT_REGISTER_USER = "register-user";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";

export default class SocketCL {
    constructor(io) {
        io.on(EVENT_CONNECT, function(socket) {

            socket.on(EVENT_REGISTER_USER, function(msg) {
                socket.username = msg.username;
                socket.broadcast.emit(EVENT_REGISTERED_USER, msg);
            });
        
            socket.on(EVENT_CHAT_MESSAGE, function(msg) {
                msg.username = socket.username;
                io.emit(EVENT_CHAT_MESSAGE, msg);
                const chatObj = new ChatModel();
                chatObj.insertDocuments('message', [
                    {'user': msg.username, 'content': msg.message}
                ]);
            });
        
            socket.on(EVENT_USER_TYPING, function() {
                socket.broadcast.emit(EVENT_USER_TYPING, {username: socket.username});
            });
        
            socket.on(EVENT_USER_TYPING_FOCUSOUT, function() {
                socket.broadcast.emit(EVENT_USER_TYPING_FOCUSOUT);
            });
        
            socket.on(EVENT_DISCONNECT, function() {
                console.log('User disconnected');
            });
        
        });
    }
}