function scrollBottom() {
    items = document.querySelectorAll(".last-vision");
    last = items[items.length - 1];
    last.scrollIntoView();
}

function showUserLogged(username) {
    $('#username').html(username);
    $("#account-name").html(username);
    $(".input-register").remove();
    $(".show-account-info").show();
    $("#message-form fieldset").removeAttr('disabled');
}

$(function() {
    var lockingType = false;
    var socket = io();
    var username = localStorage.getItem('username');
    if (!!username) {
        showUserLogged(username);
        socket.emit('user-online', {
            username: username
        });
    }

    $('#register-form').submit(function(e) {
        e.preventDefault();
        var username = $('#user').val();
        showUserLogged(username);
        localStorage.setItem('username', username);
        socket.emit('user-online', {
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

    $("#exampleModalCenter").modal("show");
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

    socket.on('chat-message', function(msg) {
        $('#messages').append($('<li class="dummy">').html("<h6 class='acc-name'>" + msg.username + "</h6><span class='message-timer'>" + msg.time + "</span><div class='message-content'>" + msg.message + "</div>"));
        scrollBottom();
    });
    socket.on('registered-user', function(msg) {
        $('.user-online-alert').html(msg.username);
        $('.toast-user-offline').toast('hide');
        $('.toast-user-online').toast('show');
    });
    socket.on('user-typing', function(msg) {
        $("#user-typing-status").html(msg.username + " is typing ...");
    });
    socket.on('user-typing-focusout', function(msg) {
        $("#user-typing-status").html("");
    });
    socket.on('user-offline', function(msg) {
        $('.user-offline-alert').html(msg.username);
        $('.toast-user-online').toast('hide');
        $('.toast-user-offline').toast('show');
    });

    // SideNav Button Initialization
    $(".button-collapse").sideNav({
        slim: true
    });
    // SideNav Scrollbar Initialization
    var sideNavScrollbar = document.querySelector('.custom-scrollbar');
    var ps = new PerfectScrollbar(sideNavScrollbar);
});