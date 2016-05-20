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
			url: '/order',
			templateUrl: 'app/views/pages/order.html',
			controller: 'orderController',
			controllerAs: 'order',
			params: {
				phoneno: null
			},
            data: {pageTitle: '订单信息'}
		})
		.state('result', {
			url: '/result/',
			templateUrl: 'app/views/pages/result.html',
            data: {pageTitle: '结果'}
		});
		
	$locationProvider.html5Mode(true);
	
})