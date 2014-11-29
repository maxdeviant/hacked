'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    }, {
        classMethods: {
            encryptPassword: function (password, next) {
                var SALT_WORK_FACTOR = 10;

                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) {
                        throw err;
                    }

                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            throw err;
                        }

                        return next(hash);
                    });
                });
            }
        },
        instanceMethods: {
            comparePassword: function (candidatePassword, callback) {
                bcrypt.compare(candidatePassword, this.getDataValue('password'), function (err, isMatch) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, isMatch);
                });
            }
        }
    });

    return User;
};
