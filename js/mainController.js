angular.module('WikiGraph')
  .controller("mainController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";
  	$scope.victory = false;
  	$scope.targetItem = "";
  	$scope.specificVictory = false;
  	$scope.specificTarget = "";

  	$scope.findSpecific = function(search){
  		var goodPrefix = search.replace(/ /g,'');
  		$scope.ourWiki = goodPrefix;
  		$scope.wikiaSearch = "";
  	}

  	$scope.setVictoryToFalse = function(){
  		$scope.victory = false;
  		$scope.target = "";
  	}
	$scope.setSpecificVictoryToFalse = function(){
  		$scope.specificVictory = false;
  		$scope.specificTarget = "";
  	}
       
}]);