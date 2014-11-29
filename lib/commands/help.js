'use strict';

var help = function (io, user, args) {
    io.emit(user.uuid + '-response', {
        message: 'The help menu:<br>help: Display this menu.<br>say <msg>: Broadcast a message.'
    });

    return 'The help menu.';
};

module.exports = help;
