'use strict';

var fs = require('fs');
var commands = require('./valid-commands');
var escapeHtml = require('./escape-html');

var Command = function (io, user, input) {
    this.io = io;
    this.user = user;

    input = input.split(' ').reverse();

    this.command = input.pop().replace(/[^a-z]/gi, '') || '';
    this.args = input.reverse() || [];

    this.execute = function () {
        if (this.command === '') {
            return io.emit(user.uuid + '-response', {
                message: escapeHtml('')
            });
        }

        if (commands.indexOf(this.command) === -1) {
            io.emit(user.uuid + '-error', {
                message: escapeHtml(invalid(this.command))
            });

            return invalid(this.command);
        }

        var command = require('./commands/' + this.command)(this.io, this.user, this.args);

        command.execute();
    };

    function invalid(command) {
        return command + ': command not found.';
    }
};

module.exports = Command;
