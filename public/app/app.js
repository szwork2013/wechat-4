angular.module('userApp', ['app.routes'])

.run(function($rootScope, $state) {
	$rootScope.$state = $state;
})

.controller('rechargeController', function($state, $location, $http) {
	
	var vm = this;
	
	vm.submitPhoneno = submitPhoneno;
	
	function submitPhoneno() {
		
		vm.hint = '';
		
		$http.get('api/validity/' + vm.data.phoneno).success(function(data) {
			if(data.success)
				window.location.href = 'order/?state=' + vm.data.phoneno;
			else 
				vm.hint = data.message;
		});
	}
	
})

.controller('orderController', function($location, $http, $state) {
	
	var vm = this;
	
	vm.confirmOrder = confirmOrder;
	
	var wcPayParam = {};
	
	var code = $location.search().code;
	var state = $location.search().state;
	
	if(code == undefined) {
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxafeda6528eb6a895&redirect_uri=http%3a%2f%2fpay.mehunk.info%2forder%2f&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect';
	} else {
		
		$http.get('api/wcpayparam?code=' + code + '&state=' + state).success(function(data) {
			vm.loaded = true;
			vm.orderData = data.orderData;
			wcPayParam = data.wxPayParams;
		});
		
	}
	
	function confirmOrder() {
		
		WeixinJSBridge.invoke('getBrandWCPayRequest', wcPayParam, function(res){
			if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				$state.go('result');
			}
		});
    }
	
})

.controller('smsController', function($location) {
	var code = $location.search().code;
	
	if(code == undefined)
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxafeda6528eb6a895&redirect_uri=http%3a%2f%2fpay.mehunk.info%2fsms%2f&response_type=code&scope=snsapi_base#wechat_redirect';
	else 
		window.location.href = 'http://sms.mehunk.info/?code=' + code;
	
});