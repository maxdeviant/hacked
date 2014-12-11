'use strict';

var escapeHtml = require('../escape-html');
var ip = require('../ip-address');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var System = mongoose.model('System');

var ssh = function (io, user, args) {
    this.getHelpString = function () {
        return 'ssh <address> - Connects to a remote system.';
    };

    this.execute = function () {
        var target = args[0];

        if (ip.isValid(target, 4)) {
            System.findOne({
                ipv4: target
            }, function (err, system) {
                if (system === null) {
                    return io.emit(user.uuid + '-response', {
                        message: escapeHtml('No system found at ' + target + '.')
                    });
                }

                User.findOne({
                    username: user.username
                }, function (err, user) {
                    user.location = system.ipv4;

                    user.save(function (err) {
                        var timestamp = new Date().toISOString();

                        system.logs.push(timestamp + ': ' + user.username + ' connected to the system.');

                        system.save(function (err) {
                            return io.emit(user.uuid + '-response', {
                                message: escapeHtml('Connected to ' + system.ipv4 + '.')
                            });
                        });
                    });
                });
            });
        } else {
            io.emit(user.uuid + '-error', {
                message: escapeHtml(target + ' is not a valid IPv4 address.')
            });
        }
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new ssh(io, user, args);
};
