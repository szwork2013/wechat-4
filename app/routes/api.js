var http = require('http');
var config = require('../../config');

module.exports = function(app, express) {
    
    var apiRouter = express.Router();
    
    apiRouter.get('/order', function(req, res) {
        
        console.log(req.query.code);
        
        if(!req.query.code) return;
        
        var code = req.query.code;
        
        var getOpenIdUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechat.appid + '&secret=' + config.wechat.appsecret + '&code=' + code +'&grant_type=authorization_code';
        
        http.get(getOpenIdUrl, (res) => {
            console.log(`Got response: ${res.statusCode}`);
            // consume response body
            //res.resume();
            console.log(res);
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
        });
        
    });
    
}