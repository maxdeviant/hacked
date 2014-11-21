var socket = io.connect('http://localhost:3000');

socket.on('news', function (data) {
    console.log(data);
    socket.emit('some event', { my: 'data' });
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