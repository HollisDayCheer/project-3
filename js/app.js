'use strict';
angular.module('WikiGraph', ['ui.router'])
	  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	  	$stateProvider
	  		.state('home', {
	  			url: '/',
	  			templateUrl: 'templates/wiki-index.html',
	  			controller: 'graphController'
	  		})

	  		.state('specific', {
	  			url: '/:wikiName',
	  			templateUrl: 'templates/specific-index.html',
	  			controller: 'specificWikiController'
	  		});

	  	// $urlRouterProvider.otherwise("/");

	 
	}]);
