'use strict';

var escapeHtml = require('../escape-html');
var multiline = require('multiline');

var tutorial = function (io, user, args) {
    this.getHelpString = function () {
        return 'tutorial - Instructions on how to play the game.';
    };

    this.execute = function () {
        var tutorialText = multiline(function () {/*
            tutorial:
            Access the help menu by typing ≤help≥.
            Chat with other players using ≤say≥.
            Use the ≤nmap≥ command to find nearby systems to connect to.
            You can then connect to one of these systems using ≤ssh≥.
            Your money is kept in a ≤bank≥ account. View your accounts with ≤bank list≥.
        */});

        io.emit(user.uuid + '-response', {
            message: escapeHtml(tutorialText)
        });
    };

    return 200;
};

module.exports = function (io, user, args) {
    return new tutorial(io, user, args);
};
