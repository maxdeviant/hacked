'use strict';

var escapeHtml = require('../escape-html');

var ls = function (io, user, args) {
    this.getHelpString = function () {
        return 'Lists contents of a directory.';
    };

    this.execute = function () {
        io.emit(user.uuid + '-response', {
            message: escapeHtml('This should be a directory listing.')
        });
    };

    return 'This should be a directory listing.';
};

module.exports = function (io, user, args) {
    return new ls(io, user, args);
};
