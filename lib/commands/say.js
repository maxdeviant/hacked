'use strict';

var say = function (io, user, args) {
    this.getHelpString = function () {
        return 'Says a message.';
    };

    this.execute = function () {
        io.emit('broadcast-say', {
            message: user.username + ' says ' + args.join(' ')
        });
    };

    return 'say';
};

module.exports = function (io, user, args) {
    return new say(io, user, args);
};
