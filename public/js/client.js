var socket = io();

var output = function (message, className) {
    var html = '';

    if (className) {
        html = '<div ' + 'class="' + (className || '') + '">' + message + '</div>'
    } else {
        html = '<div>' + message + '</div>'
    }

    $('#output').append(html);

    $('#output').scrollTop($('#output')[0].scrollHeight);
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

$('#output').on('click', '.clickable', function () {
    $('#command').val($('#command').val() + $(this).text());
    $('#command').focus();
});

$('#command').focus();

var KEYS = Object.freeze({
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40
});

var commandHistory;
var index;
var upOnce = false;
var upCount = 0;

$('#command').keyup(function (e) {
    commandHistory = commandHistory || [];
    index = typeof index === 'undefined' ? commandHistory.length - 1 : index;

    if (e.keyCode === KEYS.ENTER) {
        var command = $('#command').val();

        commandHistory.push(command);

        index = commandHistory.length - 1;

        $('#command').val('');

        $.post('http://localhost:3000/execute', {
            command: command
        }, function (data) {

        });
    } else if (e.keyCode === KEYS.UP_ARROW) {
        $('#command').val(commandHistory[index]);

        if (index > 0) {
            index--;
        } else {
            index = 0;
        }
    } else if (e.keyCode === KEYS.DOWN_ARROW) {
        if (index < commandHistory.length - 1) {
            index++;
            $('#command').val(commandHistory[index]);
        } else if (index == commandHistory.length - 1){
            $('#command').val('');
        }
    }
});
