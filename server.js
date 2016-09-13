'use strict'
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const xmlparser = require('express-xml-bodyparser');

const config = require('./config');

const jsonParser = bodyParser.json()

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	next();
});

app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

let apiRoutes = require('./app/routes/api')(app, express);

app.use('/api', jsonParser, apiRoutes);

let xmlRoutes = require('./app/routes/wxApi')(app, express);

app.use('/xml', xmlparser({trim: false, explicitArray: false}), xmlRoutes);

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);

console.log('Magic happens on port ' + config.port);