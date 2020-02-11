const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_USER_ONLINE = "user-online";
const EVENT_USER_OFFLINE = "user-offline";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";

//default built-in socket.io event 
const EVENT_SOCKET_CONNECT = "connect";
const EVENT_SOCKET_RECONNECT = "reconnecting";
const EVENT_SOCKET_RECONNECT_ERROR = "reconnect_error";

function loadChatHistory() {
    $('#messages').html('');
    fetch("/api/chats").then(data => {
        return data.json();
    }).then(json => {
        if (!!json && json.length > 0) {
            json.map(data => {
                $('#messages').append($('<li class="dummy">').html("<h6 class='acc-name'>" + data.username + "</h6><span class='message-timer'>" + data.time + "</span><div class='message-content'>" + data.message + "</div>"));
            });
        }

        $('#exampleModalCenter').modal('hide');
        scrollBottom();
    });
}

//Scroll chat message content to bottom (see newest message)
function scrollBottom() {
    items = document.querySelectorAll(".last-vision");
    last = items[items.length - 1];
    last.scrollIntoView();
}

//Show alert who online
function showUserLogged(username) {
    $('#username').html(username);
    $("#account-name").html(username);
    $(".input-register").remove();
    $(".show-account-info").show();
    $("#message-form fieldset").removeAttr('disabled');
}

//Choose room chat
function initChatRoom(socket) {
    $('ul.room-option li').on("click", function(e) {
        alert($(this).data("room"));
    });

}

function initSocketListener(socket) {
    socket.on(EVENT_CHAT_MESSAGE, function(msg) {
        $('#messages').append($('<li class="dummy">').html("<h6 class='acc-name'>" + msg.username + "</h6><span class='message-timer'>" + msg.time + "</span><div class='message-content'>" + msg.message + "</div>"));
        scrollBottom();
    });
    socket.on(EVENT_REGISTERED_USER, function(msg) {
        $('.user-online-alert').html(msg.username);
        $('.toast-user-offline').toast('hide');
        $('.toast-user-online').toast('show');
    });
    socket.on(EVENT_USER_TYPING, function(msg) {
        $("#user-typing-status").html(msg.username + " is typing ...");
    });
    socket.on(EVENT_USER_TYPING_FOCUSOUT, function(msg) {
        $("#user-typing-status").html("");
    });
    socket.on(EVENT_USER_OFFLINE, function(msg) {
        $('.user-offline-alert').html(msg.username);
        $('.toast-user-online').toast('hide');
        $('.toast-user-offline').toast('show');
    });
    socket.on(EVENT_SOCKET_RECONNECT, function() {
        $("#exampleModalCenter").modal({ "backdrop": "static", "show": true });
    });
    socket.on(EVENT_SOCKET_CONNECT, function() {
        if (socket.connected) {
            loadChatHistory();
        }
    });
}

//Create left side bar menu
function initSideBarMenu() {
    // SideNav Button Initialization
    $(".button-collapse").sideNav({
        slim: true
    });
    // SideNav Scrollbar Initialization
    var sideNavScrollbar = document.querySelector('.custom-scrollbar');
    var ps = new PerfectScrollbar(sideNavScrollbar);
}

//Chat CTA (Call to Action)
function initChatInteraction(socket) {
    $("#exampleModalCenter").modal({ "backdrop": "static", "show": true });
    const username = localStorage.getItem('username');
    if (!!username) {
        showUserLogged(username);
        socket.emit(EVENT_USER_ONLINE, {
            username: username
        });
    }

    $('#register-form').submit(function(e) {
        e.preventDefault();
        var username = $('#user').val();
        showUserLogged(username);
        localStorage.setItem('username', username);
        socket.emit(EVENT_USER_ONLINE, {
            username: username
        });
        return false;
    });

    $('#message-form').submit(function(e) {
        e.preventDefault();
        var date = new Date();
        var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        if ($('#m').val()) {
            socket.emit('chat-message', {
                username: localStorage.getItem('username'),
                message: $('#m').val(),
                time
            });
            socket.emit("user-typing-focusout");
            $('#m').val('');
        }
        return false;
    });

    $("#m").on("keydown", function(e) {
        socket.emit("user-typing", {
            username: localStorage.getItem('username')
        });
    });

    $("#m").on("focusout", function(e) {
        socket.emit("user-typing-focusout");
    });
}

$(function() {
    var socket = io({
        reconnection: true
    });

    initChatInteraction(socket);
    initChatRoom(socket);
    initSocketListener(socket);
    initSideBarMenu();
});