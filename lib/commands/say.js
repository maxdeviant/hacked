'use strict';

var escapeHtml = require('../escape-html');

var say = function (io, user, args) {
    this.getHelpString = function () {
        return 'say <msg> - Says a message.';
    };

    this.execute = function () {
        if (args.length < 1 || args[0] === '') {
            return io.emit(user.uuid + '-error', {
                message: escapeHtml('Usage: say <msg>')
            });
        }

        return io.emit('broadcast-say', {
            message: escapeHtml(user.username + ' says ' + args.join(' '))
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new say(io, user, args);
};
