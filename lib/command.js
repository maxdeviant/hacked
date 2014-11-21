'use strict';

var fs = require('fs');

var commands = [
    'help',
    'ls'
];

var Command = function (input) {
    input = input.split(' ').reverse();

    this.command = input.pop().replace(/[^a-z]/gi, '') || '';
    this.args = input.reverse() || [];

    this.execute = function () {
        if (commands.indexOf(this.command) === -1) {
            return invalid(this.command);
        }

        return require('./commands/' + this.command)(this.args);
    };

    function invalid(command) {
        return command + ': command not found.';
    };
};

module.exports = Command;
