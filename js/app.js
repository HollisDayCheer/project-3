//IF I HAVE CHANGED THE NAME OF THE PROJECT AND I DON'T KNOW WHY IT ISN'T WORKING ON GITHUB PAGES ANYMORE
//CHECK THE BASE IN THE HEAD OF THE HTML!!!
'use strict';
angular.module('WikiGraph', ['ui.router'])
	  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	  	$stateProvider
	  		.state('home', {
	  			url: '/project-3/',
	  			templateUrl: 'templates/wiki-index.html',
	  			controller: 'graphController'
	  		})

	  		.state('specific', {
	  			url: '/project-3/:wikiName',
	  			templateUrl: 'templates/specific-index.html',
	  			controller: 'specificWikiController'
	  		});

	  	// $urlRouterProvider.otherwise("/");

	  	$locationProvider.html5Mode({
	        enabled: true,
	        requireBase: false
    	});
	}]);
