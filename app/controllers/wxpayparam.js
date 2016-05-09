'use strict'
const moment = require('moment');
const mongoose = require('mongoose');

const config = require('../../config');
const WxPayDataBase = require('../common/WxPayDataBase');
const tools = require('../common/tools');
const Simcard = require('../models/simcard');
const Chargeorder = require('../models/chargeorder');

module.exports = {
	
	getWxPayParam(req, res) {
		
		let code = req.query.code;
		let phoneno = req.query.state;
		
		//从数据库中获取号码信息
		//let phoneno = '1064809346102';
		
		Simcard.findOne({phoneno: phoneno}, {
			phoneno: 1,
			cardpackage: 1,
			feeStartDate: 1,
			feeEndDate: 1
		}, function(err, simcard) {
			
			if(err) return res.send(err);
			
			//将订单信息写入数据库
			let chargeorder = new Chargeorder();
			let orderData = {};
			
			let orderno = chargeorder.orderno = moment().format('YYYYMMDDHHmmssSSSS');
			chargeorder.phoneInfo = {
				_id: mongoose.Types.ObjectId(simcard._id),
				phoneno: simcard.phoneno,
				cardpackage: {
					name: simcard.cardpackage.name,
					fee: simcard.cardpackage.fee
				}
			};
			chargeorder.statusCode = config.statusCode.unpaid;
			orderData.exFeeEndDate = chargeorder.exFeeEndDate = simcard.feeEndDate;
			orderData.newFeeEndDate = chargeorder.newFeeEndDate = moment(new Date(simcard.feeEndDate)).add(1, 'months').endOf('month').format();
			chargeorder.orderTime = new Date();
			orderData.phoneno = simcard.phoneno;
			orderData.cardpackage = simcard.cardpackage;
			
			chargeorder.save(function(err) {
				
				if(err) {
					console.log(err);
					return res.send(err);
				}
				
				let baseDataObj = {
					appid: config.wechat.appid, //微信公众账号appid
					mch_id: config.wechat.mch_id, //微信支付商户号
					body: '套餐费_' + simcard.phoneno, //商品描述
					total_fee: simcard.cardpackage.fee, //总金额，单位为分
					spbill_create_ip: '123.57.18.0', //订单生成的机器IP
					notify_url: 'http://123.57.18.0:8085/xml/result', //接收支付成功通知的回调url
					trade_type: 'JSAPI', //JSAPI、NATIVE、APP
					nonce_str: tools.genNonceStr(),
					out_trade_no: orderno
				}
				
				let wxPayDataBase = new WxPayDataBase(code, baseDataObj);
						
				wxPayDataBase.getOpenId()
					.then(function(openid) {
						wxPayDataBase.setSign();
						return;
					}).then(function() {
						return wxPayDataBase.getWxPayParams();
					}).then(function(wxPayParams) {
						console.log(wxPayParams);
						res.json({orderData: orderData, wxPayParams: wxPayParams});
					});
				
			});
			
			

		});
	},
	
	verifyPhoneno(req, res) {
		Simcard.findOne({phoneno: req.params.phoneno}, {cardpackage: 1, feeEndDate: 1}, function(err, simcard) {
			if(err) return res.send(err);
			let hasRecharged = ['1064832020751',
				'1064832020754',
				'1064832020755',
				'1064832020776',
				'1064832020785',
				'1064832020786',
				'1064832020795',
				'1064832020801',
				'1064832020802',
				'1064832020804',
				'1064832020805',
				'1064832020806',
				'1064832020807',
				'1064832020809',
				'1064832020810',
				'1064832020811',
				'1064832020813',
				'1064832020814',
				'1064832020817',
				'1064832020820',
				'1064832020832',
				'1064832020836',
				'1064832020837',
				'1064832020839',
				'1064832020841',
				'1064832020842',
				'1064832020844',
				'1064832020849',
				'1064832020858',
				'1064832020899',
				'1064832020892',
				'1064832020856',
				'1064832020891'];

			if(simcard === null || typeof simcard.cardpackage.fee === 'undefined') {
				res.json({success: false, message: '号码不存在或者未设置套餐价格！'});
			} else if(typeof simcard.feeEndDate === 'undefined') {
				res.json({success: false, message: '卡没有激活或激活后未超过一天！'});
			} else if(hasRecharged.indexOf(req.params.phoneno) >= 0) {
				res.json({success: true});
			} else if(/^147\d{8}$|^1064832\d{6}$|^18493\d{6}$/.test(req.params.phoneno)) {
				res.json({success: false, message: '请在移动商城或者支付宝直接续费！'});
			} else {
				//console.log(req.params.phoneno + ' ' + /^147\d{8}$|^1064832\d{6}$/.test(req.params.phoneno));
				res.json({success: true});
			}
		});
	}
}