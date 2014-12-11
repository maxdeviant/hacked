'use strict';

var mongoose = require('mongoose');
var random = require('mongoose-random');

var SystemSchema = mongoose.Schema({
    ipv4: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        lowercase: true
    },
    username: {
        type: String,
        lowercase: true
    },
    password: {
        type: String
    },
    logs: [String]
});

SystemSchema.plugin(random, {
    path: '__random'
});

var System = mongoose.model('System', SystemSchema);

module.exports = System;
