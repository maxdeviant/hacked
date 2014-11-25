'use strict';

var say = function (io, user, args) {
    io.emit('broadcast-say', {
        message: user + ' says ' + args.join(' ')
    });

    return 'say';
};

module.exports = say;
