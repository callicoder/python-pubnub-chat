'use strict';

angular.module('chatApp')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/chat');    

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: '/static/modules/users/login.client.view.html',
        controller: 'loginController',
        data: {
            contentClass: 'login-content'
        }
    })
    .state('register', {
        url: '/register',
        templateUrl: '/static/modules/users/register.client.view.html',
        controller: 'registerController',
        data: {
            contentClass: 'register-content'
        }
    })
    .state('home', {
        abstract: true,
        templateUrl: '/static/modules/home/home.client.view.html'
    })
    .state('home.chat', {
        url: '/chat',
        templateUrl: '/static/modules/chat/chat.client.view.html',
        controller: 'chatController'
    });    
}]);


angular.module('chatApp')
.run(['$rootScope', 'security', '$location', function($rootScope, security, $location) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
        if(toState.data && toState.data.contentClass) {
            $rootScope.contentClass = toState.data.contentClass;
        } else {
            $rootScope.contentClass = '';
        }
    });    
}]);
