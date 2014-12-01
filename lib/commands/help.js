'use strict';

var help = function (io, user, args) {
    var message = '';

    if (args[0] === 'ls') {
        message = 'ls - Show files'
    } else {
        message = 'The help menu:<br>help: Display this menu.<br>say <msg>: Broadcast a message.';
    }

    io.emit(user.uuid + '-response', {
        message: message
    });

    return 'The help menu.';
};

module.exports = help;
