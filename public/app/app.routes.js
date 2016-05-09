angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	
	$urlRouterProvider.otherwise("/");
	
	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'app/views/pages/recharge.html',
			controller: 'rechargeController',
			controllerAs: 'recharge',
            data: {pageTitle: '续费'}
		})
		.state('order', {
			url: '/order/',
			templateUrl: 'app/views/pages/order.html',
			controller: 'orderController',
			controllerAs: 'order',
            data: {pageTitle: '订单信息'}
		})
		.state('result', {
			url: '/result/',
			templateUrl: 'app/views/pages/result.html',
            data: {pageTitle: '结果'}
		})
		.state('sms', {
			url: '/sms/',
			templateUrl: 'app/views/pages/sms.html',
			controller: 'smsController',
			controllerAs: 'sms',
			data: {pageTitle: '短信跳转'}
		})
		.state('sms1', {
			url: '/sms',
			templateUrl: 'app/views/pages/sms.html',
			controller: 'smsController',
			controllerAs: 'sms',
			data: {pageTitle: '短信跳转'}
		});
		
	$locationProvider.html5Mode(true);
	
})