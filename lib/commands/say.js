'use strict';

var escapeHtml = require('../escape-html');

var say = function (io, user, args) {
    this.getHelpString = function () {
        return 'say <msg> - Says a message.';
    };

    this.execute = function () {
        io.emit('broadcast-say', {
            message: escapeHtml(user.username + ' says ' + args.join(' '))
        });
    };

    return 'say';
};

module.exports = function (io, user, args) {
    return new say(io, user, args);
};
