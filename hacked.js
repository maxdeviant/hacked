'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var debug = require('debug')('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var models = require('./models');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var router = express.Router();

router.route('/')
    .get(function (req, res) {
        return res.render('index');
    });

router.route('/register')
    .get(function (req, res) {
        return res.render('register');
    })
    .post(function (req, res) {
        models.User.encryptPassword(req.body.password, function (hash) {
            models.User.build({
                username: req.body.username,
                password: hash
            })
            .save()
            .success(function (callback) {
                return res.redirect('/register');
            })
            .error(function (error) {
                return res.json(error);
            });
        })
    });

router.route('/execute')
    .post(function (req, res) {
        var command = req.body.command;

        return res.status(200).json({
            message: 'Command: "' + command + '" received.'
        });
    });

app.use('/', router);

io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });

    socket.on('some event', function (data) {
        console.log(data);
    });
});

app.set('port', process.env.PORT || 3000);

models.sequelize.sync().success(function () {
    server.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
});
