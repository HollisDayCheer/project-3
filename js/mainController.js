angular.module('WikiGraph')
  .controller("mainController", [ '$scope', '$http', function( $scope, $http) {
  	$scope.ourWiki = "";
  	$scope.wikiaSearch = "";

  	$scope.findSpecific = function(search){
  		var goodPrefix = search.replace(/ /g,'');
  		console.log(goodPrefix);
  		if(checkUrl("http://" + goodPrefix + ".wikia.com")){
  			$scope.ourWiki = goodPrefix;
  			$scope.wikiaSearch = "";
  			return true;
  		} else{
  			console.log("couldn't find it");
  			$scope.wikiaSearch = "";
  			return false;
  		}
  // 		$http.get("http://" + goodPrefix + ".wikia.com").success(function(){
  // 			$scope.ourWiki = goodPrefix;
  // 			return true;
  // 		}).error(function(){
		// 	$scope.wikiaSearch = "";
		// 	return false;
		// });
  	}

  	function checkUrl(url) {
        var request = false;
        if (window.XMLHttpRequest) {
                request = new XMLHttpRequest;
        } else if (window.ActiveXObject) {
                request = new ActiveXObject("Microsoft.XMLHttp");
        }

        if (request) {
                request.open("GET", url);
                if (request.status == 200) { return true; }
        }
    }

        




}]);