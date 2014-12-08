'use strict';

var escapeHtml = require('../escape-html');
var uuid = require('node-uuid');
var multiline = require('multiline');

var mongoose = require('mongoose');

var log = function (io, user, args) {
    this.getHelpString = function () {
        return 'log - Lists contents of the log.';
    };

    this.execute = function () {
        var operation = args[0];

        if (typeof operation === 'undefined' || operation === null || operation === '') {
            io.emit(user.uuid + '-response', {
                message: escapeHtml(multiline(function () {/*
                    show <user> - shows user log.
                    edit <user> - allows user to edit log.
                */}))
            });
        };

        User.findOne({
            username: user.username
        }, function (err, user) {
            if (operation === 'show') {
                if (user.ulog === null || user.ulog === 'undefined'){
                        return io.emit(user.uuid + '-response', {
                        message: escapeHtml('There are no logs availible.')
                    });
                };
            };

        return 200;
    };
};

module.exports = function (io, user, args) {
    return new log(io, user, args);
};