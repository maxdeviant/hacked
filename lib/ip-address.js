'use strict';

var ip = function () {
    this.v4 = function () {
        var address = [];

        for (var i = 0; i < 4; i++) {
            address.push(Math.floor(Math.random() * 255));
        }

        return address.join('.');
    };

    this.v6 = function () {
        var address = [];

        for (var i = 0; i < 8; i++) {
            address.push(Math.floor(Math.random() * 65535).toString(16));
        }

        return address.join(':');
    };
};

module.exports = new ip;
