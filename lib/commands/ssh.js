'use strict';

var escapeHtml = require('../escape-html');

var ssh = function (io, user, args) {
    this.getHelpString = function () {
        return 'Connects to a remote system.';
    };

    this.execute = function () {
        var target = args[0];

        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(target)) {
            io.emit(user.uuid + '-response', {
                message: escapeHtml('Connects to a remote system.')
            });
        } else {
            io.emit(user.uuid + '-error', {
                message: escapeHtml(target + ' is not a valid IPv4 address.')
            });
        }
    };

    return 'Connects to a remote system.';
};

module.exports = function (io, user, args) {
    return new ssh(io, user, args);
};
