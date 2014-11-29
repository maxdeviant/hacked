'use strict';

var say = function (io, user, args) {
    io.emit('broadcast-say', {
        message: user.username + ' says ' + args.join(' ')
    });

    return 'say';
};

module.exports = say;
