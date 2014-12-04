'use strict';

var escapeHtml = require('../escape-html');

var bankhelp = function (io, user, args) {
    this.getHelpString = function () {
        return 'bankhelp - describes the functions of the bank command.';
    };

    this.execute = function () {
        io.emit(user.uuid + '-response', {
			message: escapeHtml('test message')
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new bankhelp(io, user, args);
};
