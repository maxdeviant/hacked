'use strict';

var mongoose = require('mongoose');
var ip = require('../lib/ip-address');

var SystemSchema = mongoose.Schema({
    ipv4: {
        type: String,
        required: true,
        default: ip.v4()
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
    }
});

var System = mongoose.model('System', SystemSchema);

module.exports = System;
