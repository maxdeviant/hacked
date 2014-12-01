'use strict';

var fs = require('fs');
var commands = require('./valid-commands');

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

        var command = require('./commands/' + this.command)(this.io, this.user, this.args);

        return command.execute();
    };

    function invalid(command) {
        return command + ': command not found.';
    };
};

module.exports = Command;
