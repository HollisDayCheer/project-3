angular.module('WikiGraph')
  .controller("specificWikiController", [ '$scope', '$http', '$stateParams', function( $scope, $http, $stateParams) {
    console.log('Specific Controller is working');
    var ZoomChartsLicense = "ZCS-r50128xet: Free ZoomCharts development licence for hol..@..n.edu (valid for development and QA only)";
var ZoomChartsLicenseKey = "bb7924e4f05f54b7fc036c803df2f441449f427f12ccc64ced"+
"79fb9dcb2f6eb53fa80894138275980ccbc14bbc3376e5dfbe0e86ca89a703e9bdf49828b5f78"+
"32c79df9f9222b625b90b676806d8a17a6c7b5e7207dbee9bfa320bf688c6666155e7cd78e40b"+
"d5588523ad5247fef7866601a5274cabcb13ba5e3a73c0eb82223132f27400417c84398853cd3"+
"885c4bbb3e1fd2116003c4f9c3202fee68771a3ab965bb3132780fb87bd95e86994a340650526"+
"1fcdf53f933996ce1d010bfafdfaa56aeb4744437bb753c9847fc032b74294eb1540ad8faee50"+
"a72fe6dd3a72417c044c83151f2e0bc88cedd4482f104a9a003e3f18ed42f8347acaa47499f77";
    $scope.specificTarget = ""; //will be hit with an ng-model searchTerm
    $scope.solutionArray = []; //array starts out empty, refreshes with each page refresh because 
    //because the graph restarts, and we fill it as we add to our chart
    // $scope.search = function(target){
    //   // finds the closest wikipedia article (first one queried with an api call)
    // }
    $scope.specificClicks = 0;
    var visitedMap = {};
    $scope.specificVictory = false;
    $scope.pageLinks =[];
    var numbNodes = 0;
    var ourChart;
    var graphStart = function(){
        ourChart = new NetChart({
            container: document.getElementById("specific-chart-container"),
            area: { height: 350 },
            data: {  },
            events: {
                onDoubleClick: nodeDoubleClick,
                onClick: getInfo
            },
            style: {
                link: { fillColor: "limegreen" },
                node: { imageCropping: true },
                nodeStyleFunction: getImage
            },
            interaction: {
                resizing: {
                    enabled: false
                },
                zooming:{
                    autoZoom: false,
                    autoZoomAfterClick: false,
                    zoomInOnDoubleClick: false
                }
            }
         });
        $scope.specificVictory = false;

        console.log("Graph started");
    }

     function getInfo(event){
        if(event.clickNode){
            // console.log(event.clickNode.id);
            var myEl = angular.element( document.querySelector('#specific-articles-container'));
            if(event.clickNode.image){
                $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+event.clickNode.id+"&format=json&callback=JSON_CALLBACK&redirects&prop=text").then(function(data){
                    var div = document.createElement("div");
                    div.innerHTML = data.data.parse.text['*'];
                    var paragraphs = div.getElementsByTagName("p");
                    var contentString = ""
                    console.log(paragraphs);
                    for(var i = 0; i < paragraphs.length; i++)
                    {
                        contentString += "<p>" + paragraphs[i].innerHTML + "</p>";
                    }
                    myEl.html("<div class = 'wiki-title' id='title-container'><h1>" + event.clickNode.id + "</h1></div><div class = 'wiki-content' id='content-container'><img src = '" + event.clickNode.image + "'><p>" + contentString + "</p></div>");
                });
            } else{
                $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+event.clickNode.id+"&format=json&callback=JSON_CALLBACK&redirects&prop=text").then(function(data){
                    myEl.html("<div class = 'wiki-title' id='title-container'><h1>" + event.clickNode.id + "</h1></div><div class = 'wiki-content' id='content-container'><p>" + data.data.parse.text['*'] + "</p></div>");
                });            }
            if(event.clickNode.id.toLowerCase() == $scope.specificTarget.toLowerCase()){
                $scope.specificVictory = true;
                $scope.specificClicks+=1;
            }
        }
    }

    function getImage(node){
        $http.jsonp("http://" + $scope.ourWiki + ".wikia.com/api.php?action=imageserving&wisTitle="+ node.id +"&format=json&callback=JSON_CALLBACK&redirects").then(function(imageData){
            if(imageData.data.image.imageserving){
                node.image = imageData.data.image.imageserving;
            }
            else{
                //google image stuff here
            }
        });
        visitedMap[node.id] = true;
    }
     function nodeDoubleClick(event){
        if(event.clickNode){
            $scope.continueGraph(event.clickNode.id);
        }
        $scope.specificClicks +=1;
     }
    //This is technically repeating myself, but I am ok with that because I want the set page to be a scoped variable, meaning it needs to 
    //be a different function than the generic add nodes function
     $scope.startGraph = function(title){
        graphStart()
        $scope.gameStart(title);
        $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+title+"&format=json&callback=JSON_CALLBACK&redirects&prop=text|links&plnamespace=0").then(function(data){
        }).then(function(data){
            $scope.continueGraph(title);
        });
    }
    $scope.continueGraph = function(title){
        $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+title+"&format=json&callback=JSON_CALLBACK&redirects&prop=text|links&plnamespace=0").then(function(data){
            baseNodeID = title;
            // basePage = (data.data.query.pages[basePageID].extract.toLowerCase());
        }).then(function(data){
            var newLinks = getLinks(title)               
            $scope.pageLinks.concat(newLinks)
            });

        var getLinks = function(title){
            var pageLinks = [];
            $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+title+"&format=json&callback=JSON_CALLBACK&redirects&prop=text|links&plnamespace=0").then(function(data){
                ourLinks = data.data.parse.links;
                for(var i = 0; i < ourLinks.length; i++){
                    pageLinks.push(ourLinks[i].title);
                    var linkData = {nodes: [{id: ourLinks[i]['*'], loaded: true, style: {label: ourLinks[i]['*'], fillColor:  "#67B486"}}],
                                   links: [{ id: ourLinks[i]['*'] + "link", from: baseNodeID, to: ourLinks[i]['*']}]}; 
                    ourChart.addData(linkData);
                    numbNodes += 1;
                }
            });
     
        return pageLinks;
    }
     };



//GAME START

    $scope.gameStart = function(title){
        $scope.specificClicks = 0;
        var solutionArray = [];
        var visitedNodes = [];
        solutionArray.push(title);
        var target = findRandItem(title);

        function findRandItem(curItem){
            if(solutionArray.length>4){
                $scope.specificTarget = curItem;
                $scope.solutionArray = solutionArray;
                return curItem;
            }
            else {  
                $http.jsonp("http://"+ $scope.ourWiki + ".wikia.com/api.php?action=parse&section=0&page="+curItem+"&format=json&callback=JSON_CALLBACK&redirects&prop=text|links&plnamespace=0").then(function(data){
                    var ourLinks = data.data.parse.links;
                    var activeLinks = [];
                    for(var i = 0; i< ourLinks.length; i++){
                        if(visitedNodes.indexOf(ourLinks[i]['*']) == -1){
                            activeLinks.push(ourLinks[i]['*']);
                            visitedNodes.push(ourLinks[i]['*']);
                        }
                    }
                    // console.log("our active Links are::");
                    // console.log(activeLinks);
                    if(activeLinks.length == 0){
                        $scope.specificTarget = curItem;
                        $scope.solutionArray = solutionArray;
                        console.log(solutionArray);
                        return curItem;
                    }
                    // console.log(activeLinks);
                    var targetIndex = Math.floor(Math.random() * (activeLinks.length - 1));
                    var nextItem = activeLinks[targetIndex];
                    solutionArray.push(nextItem);
                    return findRandItem(nextItem);
                });
            }
        }
    }

    $scope.setSpecificVictoryToFalse = function(){
        $scope.specificVictory = false;
        $scope.specificTarget = "";
    }

    $scope.startGraph();
      //recursive function getAllImages(pageID){
        //apiPageID
        //push those into the array
        //if page.data.continue
        //since inside of the function I won't need to pass in the array
        //function getMOREpages(continue.plcontinue)
        //api call with new continue
        //push stuff in
        //if page.continue
        //getMOREpages(new.data.continue.plcontinue)
      //}
}]);