'use strict';

var escapeHtml = require('../escape-html');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var System = mongoose.model('System');

var nmap = function (io, user, args) {
    this.getHelpString = function () {
        return 'nmap - Returns a list of nearby systems.';
    };

    this.execute = function () {
        User.findOne({
            username: user.username
        }, function (err, user) {
            System.findRandom({
                ipv4: {
                    $ne: user.location
                }
            })
            .limit(5)
            .exec(function (err, systems) {
                var message = 'nmap found the following systems nearby:\n';

                for (var i in systems) {
                    message += '≤' + systems[i].ipv4 + '≥\n';
                }

                return io.emit(user.uuid + '-response', {
                    message: escapeHtml(message)
                });
            });
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new nmap(io, user, args);
};
