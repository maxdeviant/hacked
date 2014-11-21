var socket = io();

socket.on('broadcast-login', function (data) {
    console.log(data);
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