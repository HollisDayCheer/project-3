angular.module('WikiGraph')
  .controller("mainController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";

  	$scope.findSpecific = function(search){
  		var goodPrefix = search.replace(/ /g,'');
  		$http.get("http://" + goodPrefix + ".wikia.com").success(function(){
  			$scope.ourWiki = goodPrefix;
  			return true;
  		}).error(function(){
			$scope.wikiaSearch = "";
			return false;
		});
  	}




}]);