var socket = io();

var output = function (message, className) {
    var html = '';

    if (className) {
        html = '<div ' + 'class="' + (className || '') + '">' + message + '</div>'
    } else {
        html = '<div>' + message + '</div>'
    }

    $('#output').append(html);
};

socket.on('broadcast-login', function (data) {
    output(data.message, 'broadcast');
});

socket.on('broadcast-say', function (data) {
    output(data.message, 'broadcast');
});

socket.on(user + '-response', function (data) {
    output(data.message, 'private');
});

socket.on(user + '-error', function (data) {
     output(data.message, 'error');
});

$('#command').focus();

$('#command').keyup(function (e) {
    if (e.keyCode === 13) {
        var command = $('#command').val();

        $('#command').val('');

        $.post('http://localhost:3000/execute', {
            command: command
        }, function (data) {
            $('#output').scrollTop($('#output')[0].scrollHeight);
        });
    }
});

