angular.module('WikiGraph')
  .controller("mainController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";

  	$scope.findSpecific = function(search){
  		$http.head("http://" +search+ ".wikia.com").success(function(){
  			$scope.ourWiki = search;
  			return true;
  		});
		$scope.wikiaSearch = "";
		return false;
  	}



}]);