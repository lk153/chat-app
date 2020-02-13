const EVENT_CHAT_MESSAGE = "chat-message";
const EVENT_USER_ONLINE = "user-online";
const EVENT_USER_OFFLINE = "user-offline";
const EVENT_REGISTERED_USER = "registered-user";
const EVENT_USER_TYPING = "user-typing";
const EVENT_USER_TYPING_FOCUSOUT = "user-typing-focusout";
const EVENT_USER_JOIN_ROOM = "user-join-room";

//default built-in socket.io event 
const EVENT_SOCKET_CONNECT = "connect";
const EVENT_SOCKET_RECONNECTING = "reconnecting";
const EVENT_SOCKET_RECONNECT_ERROR = "reconnect_error";

function loadChatHistory(room) {
    $("#messages").html("");
    fetch("/api/chats?" + new URLSearchParams({
        room
    })).then(data => {
        return data.json();
    }).then(json => {
        if (!!json && json.length > 0) {
            json.map(data => {
                $("#messages").append($("<li class='dummy'>").html("<h6 class='acc-name'>" + data.username + "</h6><span class='message-timer'>" + data.time + "</span><div class='message-content'>" + data.message + "</div>"));
            });
        }
        $("#exampleModalCenter").modal("hide");
        scrollBottom();
    }).catch((error) => {
        console.error('Error:', error);
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
    $("#username").html(username);
    $("#account-name").html(username);
    $(".input-register").remove();
    $(".show-account-info").show();
    $("#message-form fieldset").removeAttr("disabled");
}

//User join room
function chatRoomHandler(socket) {
    $("ul.room-option li").on("click", (e) => {
        let room = $(this).data("room");
        const username = localStorage.getItem("username");
        const gender = localStorage.getItem("gender");
        localStorage.setItem("room", room);
        socket.emit(EVENT_USER_JOIN_ROOM, {
            username,
            room,
            gender
        }, (flag) => {
            if (flag == true) {
                $("#exampleModalCenter").modal({ "backdrop": "static", "show": true });
                loadChatHistory(room);
            }
        });
    });
}

function initSocketListener(socket) {
    socket.on(EVENT_CHAT_MESSAGE, function(msg) {
        $("#messages").append($("<li class='dummy'>").html("<h6 class='acc-name'>" + msg.username + "</h6><span class='message-timer'>" + msg.time + "</span><div class='message-content'>" + msg.message + "</div>"));
        scrollBottom();
    });
    socket.on(EVENT_REGISTERED_USER, function(msg) {
        $(".user-online-alert").html(msg.username);
        $(".toast-user-offline").find("img").attr("src", "/image/" + msg.gender + ".png");
        $(".toast-user-online").find("img").attr("src", "/image/" + msg.gender + ".png");
        setTimeout(() => {
            $(".toast-user-offline").toast("hide");
            $(".toast-user-online").toast("show");
        }, 300);
    });
    socket.on(EVENT_USER_TYPING, function(msg) {
        $("#user-typing-status").html(msg.username + " is typing ...");
    });
    socket.on(EVENT_USER_TYPING_FOCUSOUT, function(msg) {
        $("#user-typing-status").html("");
    });
    socket.on(EVENT_USER_OFFLINE, function(msg) {
        $(".user-offline-alert").html(msg.username);
        $(".toast-user-online").find("img").attr("src", "/image/" + msg.gender + ".png");
        $(".toast-user-offline").find("img").attr("src", "/image/" + msg.gender + ".png");
        setTimeout(() => {
            $(".toast-user-online").toast("hide");
            $(".toast-user-offline").toast("show");
        }, 300);
    });
    socket.on(EVENT_SOCKET_RECONNECTING, function() {
        $("#exampleModalCenter").modal({ "backdrop": "static", "show": true });
    });
    socket.on(EVENT_SOCKET_CONNECT, function() {
        if (socket.connected) {
            const username = localStorage.getItem("username");
            const gender = localStorage.getItem("gender");
            const room = localStorage.getItem("room");
            if (!!username && !!room) {
                socket.emit(EVENT_USER_ONLINE, {
                    username,
                    gender,
                    room
                }, (flag) => {
                    if (flag == true) {
                        loadChatHistory(room);
                    }
                });
            }
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
    var sideNavScrollbar = document.querySelector(".custom-scrollbar");
    var ps = new PerfectScrollbar(sideNavScrollbar);
}

//Chat CTA (Call to Action)
function initChatInteraction(socket) {
    if (!!username) {
        showUserLogged(username);
    }

    //Register user
    $("#register-form").submit((e) => {
        e.preventDefault();
        var username = $("#user").val();
        var gender = $("input[name='gender']:checked").val();
        var room = "General";

        showUserLogged(username);
        localStorage.setItem("username", username);
        localStorage.setItem("gender", gender);
        socket.emit(EVENT_USER_ONLINE, {
            username,
            gender,
            room
        }, (flag) => {
            if (flag == true) {
                loadChatHistory(room);
            }
        });
        return false;
    });

    //Chat message
    $("#message-form").submit((e) => {
        e.preventDefault();
        var date = new Date();
        var time = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
        if (localStorage.getItem("room") == null) {
            localStorage.setItem("room", "General");
        }
        const room = localStorage.getItem("room");

        if ($("#m").val()) {
            socket.emit(EVENT_CHAT_MESSAGE, {
                username: localStorage.getItem("username"),
                message: $("#m").val(),
                time,
                room
            });
            socket.emit("user-typing-focusout", {
                room
            });
            $("#m").val("");
        }
        return false;
    });

    //User is typing
    $("#m").on("keydown", function(e) {
        var room = localStorage.getItem("room");
        socket.emit("user-typing", {
            username: localStorage.getItem("username"),
            room

        });
    });

    //User is not typing
    $("#m").on("focusout", function(e) {
        var room = localStorage.getItem("room");
        socket.emit("user-typing-focusout", {
            room
        });
    });

    $("#logout-cta").on("click", function() {
        localStorage.clear();
        location.reload();
    });
}

$(function() {
    var socket = io("/admin", {
        reconnection: true
    });

    initChatInteraction(socket);
    chatRoomHandler(socket);
    initSocketListener(socket);
    initSideBarMenu();
});