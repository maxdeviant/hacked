'use strict';

var fs = require('fs');

var commands = [
    'help',
    'ls',
    'say'
];

var Command = function (io, user, input) {
    this.io = io;
    this.user = user;

    input = input.split(' ').reverse();

    this.command = input.pop().replace(/[^a-z]/gi, '') || '';
    this.args = input.reverse() || [];

    this.execute = function () {
        if (commands.indexOf(this.command) === -1) {
            return invalid(this.command);
        }

        return require('./commands/' + this.command)(this.io, this.user, this.args);
    };

    function invalid(command) {
        return command + ': command not found.';
    };
};

module.exports = Command;
