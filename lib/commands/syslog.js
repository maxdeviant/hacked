'use strict';

var escapeHtml = require('../escape-html');
var uuid = require('node-uuid');
var multiline = require('multiline');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var System = mongoose.model('System');

var syslog = function (io, user, args) {
    this.getHelpString = function () {
        return 'syslog - Interact with system logs.';
    };

    this.execute = function () {
        var operation = args[0];

        if (typeof operation === 'undefined' || operation === null || operation === '') {
            io.emit(user.uuid + '-response', {
                message: escapeHtml(multiline(function () {/*
                    syslog:
                    show - Display the logs for the current system.
                    clear - Clear the logs for the current system.
                */}))
            });
        };

        User.findOne({
            username: user.username
        }, function (err, user) {
            System.findOne({
                ipv4: user.location
            }, function (err, system) {
                if (err || system === null) {
                    return io.emit(user.uuid + '-error', {
                        message: escapeHtml('Could not retrieve sytem at ' + user.location)
                    });
                }

                if (operation === 'show') {
                    if (system.logs.length < 1) {
                        return io.emit(user.uuid + '-response', {
                            message: escapeHtml('No logs found on ' + system.ipv4)
                        });
                    }

                    return io.emit(user.uuid + '-response', {
                        message: escapeHtml('System logs:\n' + system.logs.join('\n'))
                    });
                }

                if (operation === 'clear') {
                    system.logs = [];

                    system.save(function (err) {
                        if (err) {
                            return io.emit(user.uuid + '-error', {
                                message: escapeHtml('An error occurred while clearing the system logs.')
                            });
                        }

                        return io.emit(user.uuid + '-response', {
                            message: escapeHtml('System logs cleared.')
                        });
                    });
                }
            });
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new syslog(io, user, args);
};
