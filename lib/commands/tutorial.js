'use strict';

var escapeHtml = require('../escape-html');
var multiline = require('multiline');

var tutorial = function (io, user, args) {
    this.getHelpString = function () {
        return 'tutorial - Instructions on how to play the game.';
    };

    this.execute = function () {
        var tutorialText = multiline(function () {/*
            Tutorial goes here.
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
