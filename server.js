var express = require('express');
var app = express();
var morgan = require('morgan');
var config = require('./config');
var path = require('path');

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

//var apiRoutes = require('./app/routes/api')(app, express);

//app.use('/api', apiRoutes);

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);

console.log('Magic happens on port ' + config.port);