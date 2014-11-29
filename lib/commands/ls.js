'use strict';

var ls = function (io, user, args) {
    io.emit(user.uuid + '-response', {
        message: 'this is private'
    });

    return 'This should be a directory listing.'
};

module.exports = ls;
