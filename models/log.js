'use strict';

var mongoose = require('mongoose');

var LogSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    loghistory: {
        type: String,
        required: true
    }
});

var Log = mongoose.model('Log', LogSchema);

module.exports = Log;
