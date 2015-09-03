'use strict';

angular.module('chatApp')
.controller('chatController', ['$scope', 'security', '$state', '$http', 'PubNub', '$rootScope', '$timeout', function($scope, security, $state, $http, PubNub, $rootScope, $timeout){
	PubNub.init({
  		publish_key:'pub-c-5c8931d3-4638-4479-a216-2bb9aa6e7a18',
  		subscribe_key:'sub-c-461707f2-515c-11e5-81b5-02ee2ddab7fe',
      	ssl : (('https:' == document.location.protocol) ? true : false)
	});

	$scope.messages = [];
	var theChannel = 'ChatApp';


	function updateScroll(){
		$('#chat').animate({
  			scrollTop: $('#chat').get(0).scrollHeight
  		}, 100);
	}

	$http.get('/messages')
	.then(function(response){
		console.log(response.data);
		$scope.messages = response.data;
		$timeout(function(){
			updateScroll();	
		}, 0)
	})


	$scope.publish = function() {
  		PubNub.ngPublish({
    		channel: theChannel,
    		message: $scope.messageText
  		});
  		$scope.messageText = '';
	};

	$scope.subscribe = function() {
  		PubNub.ngSubscribe({ 
  			channel: theChannel 
  		});
  
  		$rootScope.$on(PubNub.ngMsgEv(theChannel), function(event, payload) {
    		// payload contains message, channel, env...
    		console.log('got a message event:', payload);
    		$timeout(function(){
				$scope.messages.push(payload);
				updateScroll()
    		}, 0);
    	});

  		$rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {
    		// payload contains message, channel, env...
    		console.log('got a presence event:', payload);

    		$scope.users = PubNub.ngListPresence(theChannel);
  		});
  	};

  	$scope.subscribe();
  		
}]);
