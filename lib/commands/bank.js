'use strict';

var escapeHtml = require('../escape-html');
var uuid = require('node-uuid');
var multiline = require('multiline');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var BankAccount = mongoose.model('BankAccount');


var bank = function (io, user, args) {
    this.getHelpString = function () {
        return 'bank - Perform financial operations.';
    };

    this.execute = function () {
        var operation = args[0];

        if (typeof operation === 'undefined' || operation === null || operation === '') {
            io.emit(user.uuid + '-response', {
                message: escapeHtml(multiline(function () {/*
                    open <pin> - Opens an account with the given PIN.
                    list - Lists all of your accounts.
                    transfer <accountA> <pin> <accountB> <amount> - Transfer the specified amount from account A to account B.
                    balance <account> - Shows the balance of the specified account.
                    close <account> <pin> - Closes an account. Balance must be empty.
                    history <account> - Displays the transfer history for an account.
                */}))
            });
        }

        User.findOne({
            username: user.username
        }, function (err, user) {
            if (operation === 'open') {
                var account = new BankAccount();

                if (!/^\d+$/.test(args[1])) {
                    return io.emit(user.uuid + '-error', {
                        message: escapeHtml('Account PIN must be a number.')
                    });
                }

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

            if (operation === 'balance') {
                var number = args[1];
                var subCommand = args[2];

                BankAccount.findOne({
                    number: number
                }, function (err, account) {
                    if (err || account === null) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Account #' + number + ' not found.')
                        });
                    }

                    if (typeof subCommand === 'undefined' || subCommand === null || subCommand === '') {
                        return io.emit(user.uuid + '-response', {
                            message: escapeHtml('Account #' + number + ' balance: $' + account.balance.toFixed(2))
                        });
                    }

                    if (subCommand === 'add' && user.isAdmin) {
                        var amount = parseFloat(args[3]);

                        if (isNaN(amount)) {
                            return io.emit(user.uuid + '-error', {
                                message: escapeHtml('Amount must be a number.')
                            });
                        }

                        console.log(amount)

                        account.balance += amount;

                        account.save(function (err) {
                            if (err) {

                            }

                            return io.emit(user.uuid + '-response', {
                                message: escapeHtml('Added $' + amount.toFixed(2) + ' to #' + number)
                            });
                        });
                    }

                    return io.emit(user.uuid + '-error', {
                        message: escapeHtml(subCommand + ' is not a command.')
                    });
                });
            }

            if (operation === 'close') {
                var number = args[1];
                var pin = parseInt(args[2]);

                BankAccount.findOne({
                    number: number
                }, function (err, account) {
                    if (err || account === null) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Account #' + number + ' not found.')
                        });
                    }

                    if (account.pin !== pin) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Access denied: account #' + account.number)
                        });
                    } else if (account.balance > 0){
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Account balance is not empty.')
                        });
                    } else {
                        BankAccount.findOneAndRemove({
                            number: account.number
                        }, function(err, account) {
                            return io.emit(user.uuid + '-response', {
                                message: escapeHtml('Successfully removed account #' + account.number)
                            });
                        });
                    }
                });
            }

            if (operation === 'list') {
                BankAccount.find({
                    owner: user.username
                }, function (err, accounts) {
                    var message = 'You own the following accounts:\n';

                    for (var i in accounts) {
                        message += '≤' + accounts[i].number + '≥ : $' + accounts[i].balance.toFixed(2) + '\n';
                    }

                    return io.emit(user.uuid + '-response', {
                        message: escapeHtml(message)
                    });
                });
            }

            if (operation === 'transfer') {
                var fromNumber = args[1];
                var fromPin = parseInt(args[2]);
                var toNumber = args[3];
                var amount = parseFloat(args[4]);

                BankAccount.findOne({
                    number: fromNumber
                }, function (err, fromAccount) {
                    if (err || fromAccount === null) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Account #' + fromNumber + ' not found.')
                        });
                    }

                    if (fromAccount.pin !== fromPin) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Access denied')
                        });
                    }

                    BankAccount.findOne({
                        number: toNumber
                    }, function (err, toAccount) {
                        if (err || toAccount === null) {
                            return io.emit(user.uuid + '-error', {
                                message: escapeHtml('Account #' + toNumber + ' not found.')
                            });
                        }

                        if (fromAccount.balance <= amount) {
                            amount = fromAccount.balance;
                        }

                        fromAccount.balance -= amount;
                        toAccount.balance += amount;

                        var timestamp = new Date().toISOString();

                        fromAccount.transferHistory.push(timestamp + ': Transferred $' + parseFloat(amount).toFixed(2) + ' to #' + toNumber);
                        toAccount.transferHistory.push(timestamp + ': Received $' + parseFloat(amount).toFixed(2) + ' from #' + fromNumber);

                        fromAccount.save(function (err) {
                            if (err) {

                            }

                            toAccount.save(function (err) {
                                if (err) {

                                }

                                return io.emit(user.uuid + '-response', {
                                    message: escapeHtml('Successfully transferred $' + parseFloat(amount).toFixed(2) + ' from #' + fromNumber + ' to #' + toNumber + '.')
                                });
                            });
                        });
                    });
                });
            }

            if (operation === 'history') {
                var number = args[1];

                BankAccount.findOne({
                    number: number
                }, function (err, account) {
                    if (err || account === null) {
                        return io.emit(user.uuid + '-error', {
                            message: escapeHtml('Account #' + fromNumber + ' not found.')
                        });
                    }

                    var history = account.transferHistory;

                    if (history.length < 1) {
                        return io.emit(user.uuid + '-response', {
                            message: escapeHtml('This account has no recorded transfers.')
                        });
                    }

                    var message = 'Transfer history for account #' + number + ':\n';

                    for (var i = 0; i < history.length; i++) {
                        message += history[i] + '\n';
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
