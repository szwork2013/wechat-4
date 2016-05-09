const wxpayparam = require('../controllers/wxpayparam');

module.exports = function(app, express) {
    
    var apiRouter = express.Router();
	
	apiRouter
		.get('/wcpayparam', wxpayparam.getWxPayParam)
		.get('/validity/:phoneno', wxpayparam.verifyPhoneno);
	
	return apiRouter;
    
}