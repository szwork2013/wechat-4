'use strict'
const xml2js = require('xml2js');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const moment = require('moment');
const request = require('superagent');
const Buffer = require('buffer').Buffer;

const config = require('../../config');

module.exports = class WxPayDataBase {
	
	constructor(code, values) {
		this.code = code;
		this.values = values;
	}
	
	
	setSign() {
		let sign = this.makeSign();
		this.values.sign = sign;
		return sign;
	}
	
	toXml() {
		let builder = new xml2js.Builder({
			//headless: true,
			cdata: true,
			rootName: 'xml'
		});
		let xml = builder.buildObject(this.values);
		return xml;
	}
	
	makeSign(toBeSigned) {
		
		toBeSigned = toBeSigned || this.values;

		let str = '';
		for (var key of Object.keys(toBeSigned).sort())
			str += key + '=' + toBeSigned[key] + '&';
		
		str += 'key=' + config.wechat.mch_key;
		
		let buff = new Buffer(str);
		let binary = buff.toString('binary');

		const hash = crypto.createHash('md5').update(binary).digest('hex');
		return hash;
	}
	
	getOpenId() {
		
		let wxPayDataBase = this;
		
		return new Promise(function(resolve, reject) {

			let queryParams = {
				appid: config.wechat.appid,
				secret: config.wechat.appsecret,
				code: wxPayDataBase.code,
				grant_type: 'authorization_code'
			}
			
			let openIdUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?' + querystring.stringify(queryParams);
			
			https.get(openIdUrl, (res) => {
				let chunks = '';
			
				res.on('data', chunk => chunks += chunk)
					.on('end', () => {
						let resJson = JSON.parse(chunks);
						wxPayDataBase.values.openid = resJson.openid;
						resolve(resJson.openid);
					});
			}).on('error', (e) => {
				reject(new Error(e.message));
			});
		});
	}
	
			
	getWxPayParams() {
		
		let wxPayDataBase = this;
		
		return new Promise(function(resolve, reject) {
			let postBody = wxPayDataBase.toXml();
			//console.log(postBody);
			request
				.post('https://' + config.wechat.prepayUrl + config.wechat.prepayPath)
				.set('Content-Type', 'application/xml')
				.send(postBody)
				.end(function(err, res) {
					if(err) resolve(err);
					
					xml2js.parseString(res.text, function (err, resJson) {

						var jsApiData = resJson.xml;
						
						var timeStampStr = moment().format('x');
						
						let jsApiJson = {
							appId: '' + jsApiData.appid,
							nonceStr: '' + jsApiData.nonce_str,
							package: 'prepay_id=' + jsApiData.prepay_id,
							signType: 'MD5',
							timeStamp: timeStampStr
						};
						
						jsApiJson.paySign = wxPayDataBase.makeSign(jsApiJson);
						resolve(jsApiJson);
					});
				});

		});
	}
}
