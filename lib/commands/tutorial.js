'use strict';

var escapeHtml = require('../escape-html');
var multiline = require('multiline');

var tutorial = function (io, user, args) {
    this.getHelpString = function () {
        return 'tutorial - help stuff';
    };

    this.execute = function () {
        io.emit(user.uuid + '-response', {
            message: escapeHtml('The tutorial.')
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new tutorial(io, user, args);
};
