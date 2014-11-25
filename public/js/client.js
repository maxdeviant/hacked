var socket = io();

socket.on('broadcast-login', function (data) {
    $('#output').append('<div>' + data.message + '</div>');
});

socket.on('broadcast-say', function (data) {
    $('#output').append('<div>' + data.message + '</div>');
});

$('#command').keyup(function (e) {
    if (e.keyCode === 13) {
        var command = $('#command').val();

        $('#command').val('');

        $.post('http://localhost:3000/execute', {
            command: command
        }, function (data) {
            console.log(data);
        });
    }
});