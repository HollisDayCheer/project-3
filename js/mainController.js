angular.module('WikiGraph')
  .controller("mainController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";

  	$scope.findSpecific = function(search){
  		var goodPrefix = search.replace(/ /g,'');
  		$scope.ourWiki = goodPrefix;
  		$scope.wikiaSearch = "";
  	}

       
}]);