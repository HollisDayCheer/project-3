angular.module('WikiGraph')
  .controller("graphController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";

  	$scope.findSpecific = function(search){
  		$scope.ourWiki = search;
  	}



}]);