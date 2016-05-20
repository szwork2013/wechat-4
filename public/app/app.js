angular.module('userApp', ['app.routes'])

.run(function($rootScope, $state) {
	$rootScope.$state = $state;
})

.controller('rechargeController', function($state, $location, $http) {
	
	var vm = this;
	
	var openId = $location.search().openId;
	
	if(!openId) {
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxafeda6528eb6a895&redirect_uri=http%3a%2f%2fpublic.mehunk.info&response_type=code&scope=snsapi_base&state=http%3a%2f%2frecharge.m2m-10086.cn#wechat_redirect';
		return;
	}
	
	if(!localStorage.getItem('openId'))
		localStorage.setItem('openId', openId);
	
	vm.submitPhoneno = submitPhoneno;
	
	function submitPhoneno() {
		
		vm.hint = '';
		
		$http.get('api/validity/' + vm.data.phoneno).success(function(data) {
			if(data.success)
				$state.go('order', {phoneno: vm.data.phoneno});
			else 
				vm.hint = data.message;
		});
	}
	
})

.controller('orderController', function($location, $http, $state, $stateParams) {
	
	var vm = this;
	
	vm.confirmOrder = confirmOrder;
	
	var openId = localStorage.getItem('openId');
	var phoneno = $stateParams.phoneno;

	if(!openId || !phoneno) {
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxafeda6528eb6a895&redirect_uri=http%3a%2f%2fpublic.mehunk.info&response_type=code&scope=snsapi_base&state=http%3a%2f%2frecharge.m2m-10086.cn#wechat_redirect';
		return;
	}
	
	var wcPayParam = {};

	$http
		.get('api/wcpayparam?openId=' + openId + '&phoneno=' + phoneno)
		.success(function(data) {
			vm.loaded = true;
			if(!data.success) {
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxafeda6528eb6a895&redirect_uri=http%3a%2f%2fpublic.mehunk.info&response_type=code&scope=snsapi_base&state=http%3a%2f%2frecharge.m2m-10086.cn#wechat_redirect';
				return;
			}
			vm.orderData = data.data.orderData;
			wcPayParam = data.data.wxPayParams;
		});

	function confirmOrder() {
		
		WeixinJSBridge.invoke('getBrandWCPayRequest', wcPayParam, function(res){
			if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				$state.go('result');
			}
		});
    }
	
});