'use strict';

var ls = function (io, user, args) {
    io.emit(user.uuid + '-response', {
        message: 'This should be a directory listing.'
    });

    return 'This should be a directory listing.';
};

module.exports = ls;
