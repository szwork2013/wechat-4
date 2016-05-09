'use strict'
const mongoose = require('mongoose');
const xml2js = require('xml2js');

const config = require('../../config');
const Simcard = require('../models/simcard');
const Chargeorder = require('../models/chargeorder');

module.exports = function(app, express) {
    
    var apiRouter = express.Router();
	
	apiRouter
		.post('/result', function(req, res) {
			let result = req.body.xml;
			console.log(result);
			if(result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
				Chargeorder.findOne({orderno: result.out_trade_no}, function(err, chargeorder) {
					if(err) return res.send(err);
					if(chargeorder.statusCode === config.statusCode.unpaid) {
						chargeorder.statusCode = config.statusCode.paid;
						chargeorder.save(function(err) {
							Simcard.findByIdAndUpdate(chargeorder.phoneInfo._id, {$set: {feeEndDate: chargeorder.newFeeEndDate}}, function(err) {
								if(err) return res.send(err);
							});
						});
					}
					
					
				});
			}
			
			let returnData = {
				return_code: 'SUCCESS',
				return_msg: ''
			};
			
			let builder = new xml2js.Builder({
				rootName: 'xml'
			});
			let xml = builder.buildObject(returnData);
			
			res.set('Content-Type', 'text/xml');
			res.send(xml);
			
		})
	
	return apiRouter;
    
}