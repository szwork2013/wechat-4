'use strict'

module.exports = {
	
	genNonceStr() {
		
		let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		let maxPos = chars.length;
		let nonceStr = '';
		
		for(let i = 0; i < 32; i++) 
			nonceStr += chars.charAt(Math.floor(Math.random() * maxPos));
		
		return nonceStr;
	},
	
}