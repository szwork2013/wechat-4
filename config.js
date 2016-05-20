module.exports = {
	'port': process.env.PORT || 8085,
	'database': 'mongodb://root:Shijiazhuang;2012@120.24.156.177:27017/cmiot?authSource=admin',
    'wechat': {
        'appid': 'wxafeda6528eb6a895',
        'appsecret': 'ed4945f780cf8cdf1ae0ed2be156779e',
		'mch_id': '1312699301',
		'mch_key': 'fARz9OiHvEz2yeHKKZLc59hZ61gUqKA7',
		'prepayUrl': 'api.mch.weixin.qq.com',
		'prepayPath': '/pay/unifiedorder'
    },
	'statusCode': {unpaid: 0, paid: 1, completed: 2},
}