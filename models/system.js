'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var System = sequelize.define('System', {
        ip: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isIP: true
            }
        }
    }, {
        classMethods: {
        },
        instanceMethods: {
        }
    });

    return System;
};
