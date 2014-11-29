var socket = io();

var output = function (message) {
    $('#output').append('<div>' + message + '</div>');
};

socket.on('broadcast-login', function (data) {
    output(data.message);
});

socket.on('broadcast-say', function (data) {
    output(data.message);
});

socket.on(user + '-response', function (data) {
    output(data.message);
});

$('#command').keyup(function (e) {
    if (e.keyCode === 13) {
        var command = $('#command').val();

        $('#command').val('');

        $.post('http://localhost:3000/execute', {
            command: command
        }, function (data) {
            $('#output').scrollTop($('#output')[0].scrollHeight);

            console.log(data);
        });
    }
});

