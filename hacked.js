'use strict';

// Import server modules
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var debug = require('debug')('express');
var jwt = require('jwt-simple');
var session = require('express-session');

// Import database models
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var ip = require('./lib/ip-address');
var User = require('./models/user');
var System = require('./models/system');
var BankAccount = require('./models/bank-account');

// Import custom modules
var jwtauth = require('./lib/jwt-auth');
var Command = require('./lib/command');

// Initialize server
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('jwtTokenSecret', 'U1VQRVJfU0VDUkVUX0tFWQ==');

app.use(session({
    secret: 'SUPER_SECRET_KEY',
    saveUninitialized: true,
    resave: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 24 * 60 * 60 * 1000
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/hacked');

var router = express.Router();

router.route('/')
    .get([jwtauth], function (req, res) {
        var uuid = jwt.decode(req.session.token, app.get('jwtTokenSecret')).iss;
        
        app.locals.output = [];
        app.locals.uuid = '\'' + uuid + '\'';

        return res.render('index');
    });

router.route('/execute')
    .post([jwtauth], function (req, res) {
        var token = jwt.decode(req.session.token, app.get('jwtTokenSecret'));

        var user = {
            uuid: token.iss,
            username: token.username
        };
        
        var command = new Command(io, user, req.body.command);

        return res.status(200).json({
            message: command.execute()
        });
    });

router.route('/register')
    .get(function (req, res) {
        app.locals.registrationError = '';

        return res.render('register');
    })
    .post(function (req, res) {
        if (/[^a-z0-9]/gi.test(req.body.username)) {
            app.locals.registrationError = 'Username must be alphanumeric.';

            return res.render('register');
        }

        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err || user !== null) {
                app.locals.registrationError = 'This username is not available.';

                return res.render('register');
            }

            var system = new System();

            system.ipv4 = ip.v4();

            system.save(function (err) {
                if (err) {
                    return res.json(err);
                }

                var user = new User();

                user.uuid = uuid.v4();
                user.username = req.body.username;
                user.password = req.body.password;
                user.home = system._id;
                user.systems.push(system._id);
                user.location = system.ipv4;

                user.save(function (err) {
                    if (err) {
                        return res.json(err);
                    }

                    var expires = new Date();
                    expires.setDate(expires.getDate() + 7);

                    var token = jwt.encode({
                        iss: user.uuid,
                        username: user.username,
                        expires: expires
                    }, app.get('jwtTokenSecret'));

                    req.session.token = token;

                    return res.redirect('/');
                });
            });
        });
    });

router.route('/login')
    .get(function (req, res) {
        app.locals.loginError = '';

        return res.render('login');
    })
    .post(function (req, res) {
        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) {

            }

            if (user === null) {
                app.locals.loginError = 'Invalid username and/or password.';

                return res.render('login');
            }

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch) {
                    var expires = new Date();
                    expires.setDate(expires.getDate() + 7);

                    var token = jwt.encode({
                        iss: user.uuid,
                        username: user.username,
                        expires: expires
                    }, app.get('jwtTokenSecret'));

                    req.session.token = token;

                    io.emit('broadcast-login', {
                        message: user.username + ' has come online.'
                    });

                    return res.redirect('/');
                }

                app.locals.loginError = 'Invalid username and/or password.';

                return res.render('login');
            });
        });
    });

router.route('/logout')
    .get(function (req, res) {
        req.session.destroy(function (err) {
            return res.redirect('login');
        });
    });

app.use('/', router);

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function () {
    console.log('Hacked server listening on port ' + server.address().port);
});
