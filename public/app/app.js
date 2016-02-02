angular.module('userApp', [])

.controller('mainController', function() {
    
    var vm = this;
    
    vm.submitPhoneno = submitPhoneno;
    
    vm.step = 0;
    
    function submitPhoneno() {
        vm.step = 1;
    }
});