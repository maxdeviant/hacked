'use strict';

var escapeHtml = require('../escape-html');
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var BankAccount = mongoose.model('BankAccount');

var bank = function (io, user, args) {
    this.getHelpString = function () {
        return 'bank - Perform financial operations.';
    };

    this.execute = function () {
        var operation = args[0];

        User.findOne({
            username: user.username
        }, function (err, user) {
            if (operation === 'open') {
                var account = new BankAccount();

                account.number = uuid.v4();
                account.pin = args[1];
                account.owner = user.username;

                account.save(function (err) {
                    if (err) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('An error occurred while creating the account.')
                        });
                    }

                    return io.emit(user.uuid + '-response', {
                        message: escapeHtml('Account #' + account.number + ' created successfully.')
                    });
                });
            }

            if (operation === 'list') {
                BankAccount.find({
                    owner: user.username
                }, function (err, accounts) {
                    var message = 'You own the following accounts:\n';

                    for (var i in accounts) {
                        message += accounts[i].number + ' : $' + accounts[i].balance + '\n';
                    }

                    return io.emit(user.uuid + '-response', {
                        message: escapeHtml(message)
                    });
                });
            }
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new bank(io, user, args);
};
