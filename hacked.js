'use strict';

var express = require('express');
var logger = require('morgan');
var path = require('path');
var debug = require('debug')('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var models = require('./models');

app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var router = express.Router();

router.route('/')
    .get(function (req, res) {
        return res.render('index');
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
