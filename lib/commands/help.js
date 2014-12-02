'use strict';

var commands = require('../valid-commands');
var escapeHtml = require('../escape-html');

var help = function (io, user, args) {
    this.getHelpString = function () {
        return 'help - Displays this menu.';
    };

    this.execute = function () {
        var message = '';

        if (commands.indexOf(args[0]) !== -1) {
            var command = require('./' + args[0])(io, user, args);

            message = command.getHelpString();
        } else {
            var helpText = [];

            for (var i in commands) {
                helpText.push(require('./' + commands[i])(io, user, args).getHelpString());
            }

            message = 'The help menu:\n' + helpText.join('\n');
        }

        io.emit(user.uuid + '-response', {
            message: escapeHtml(message)
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new help(io, user, args);
};
