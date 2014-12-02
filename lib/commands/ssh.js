'use strict';

var escapeHtml = require('../escape-html');
var ip = require('../ip-address');

var ssh = function (io, user, args) {
    this.getHelpString = function () {
        return 'ssh <address> - Connects to a remote system.';
    };

    this.execute = function () {
        var target = args[0];

        if (ip.isValid(target, 4)) {
            io.emit(user.uuid + '-response', {
                message: escapeHtml('Connects to a remote system.')
            });
        } else {
            io.emit(user.uuid + '-error', {
                message: escapeHtml(target + ' is not a valid IPv4 address.')
            });
        }
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new ssh(io, user, args);
};
