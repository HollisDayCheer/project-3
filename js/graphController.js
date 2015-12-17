//WORKING THINGS
//PLURAL VS SINGULAR NORMALIZED
//NO THING ON GRAPH TWICE

angular.module('WikiGraph')
  .controller("graphController", [ '$scope', '$http', function( $scope, $http) {
    console.log('controller is working');
    var ZoomChartsLicense = "ZCS-r50128xet: Free ZoomCharts development licence for hol..@..n.edu (valid for development and QA only)";
var ZoomChartsLicenseKey = "bb7924e4f05f54b7fc036c803df2f441449f427f12ccc64ced"+
"79fb9dcb2f6eb53fa80894138275980ccbc14bbc3376e5dfbe0e86ca89a703e9bdf49828b5f78"+
"32c79df9f9222b625b90b676806d8a17a6c7b5e7207dbee9bfa320bf688c6666155e7cd78e40b"+
"d5588523ad5247fef7866601a5274cabcb13ba5e3a73c0eb82223132f27400417c84398853cd3"+
"885c4bbb3e1fd2116003c4f9c3202fee68771a3ab965bb3132780fb87bd95e86994a340650526"+
"1fcdf53f933996ce1d010bfafdfaa56aeb4744437bb753c9847fc032b74294eb1540ad8faee50"+
"a72fe6dd3a72417c044c83151f2e0bc88cedd4482f104a9a003e3f18ed42f8347acaa47499f77";
    $scope.specific = "";
    $scope.searchTerm = ""; //will be hit with an ng-model searchTerm
    $scope.solutionArray = []; //array starts out empty, refreshes with each page refresh because 
    //because the graph restarts, and we fill it as we add to our chart
    $scope.targetItem = "";
    $scope.victory = false;
    $scope.pageLinks =[];
    var visitedMap = {};
    var numbNodes = 0;
    var ourChart;
    var graphStart = function(){
        ourChart = new NetChart({
            container: document.getElementById("chart-container"),
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
        $scope.victory = false;
    }

    function getInfo(event){
        if(event.clickNode){
           if(event.clickNode.image){
               $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&titles="+ event.clickNode.id +"&format=json&callback=JSON_CALLBACK&redirects&").then(function(data){
                           angular.element(document.querySelector('#articles-container')).html("<div class = 'wiki-title' id='title-container'><h1>" + event.clickNode.id + "</h1></div><img src = '" + event.clickNode.image + "'><div class = 'wiki-content' id='content-container'><p>" + data.data.query.pages[Object.keys(data.data.query.pages)[0]].extract + "</p></div>");
               });
            }else{
                $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&titles="+ event.clickNode.id +"&format=json&callback=JSON_CALLBACK&redirects&").then(function(data){
                           angular.element(document.querySelector('#articles-container')).html("<div class = 'wiki-title' id='title-container'><h1>" + event.clickNode.id + "</h1><img src = 'http://www.wildimagesphotography.com/images/0049-WO-Panda-Face.jpg'></div><div class = 'wiki-content'id='content-container'><p>" + data.data.query.pages[Object.keys(data.data.query.pages)[0]].extract + "</p></div>");
               });
            }
            if($scope.targetItem.toLowerCase() == event.clickNode.id.toLowerCase()){
                $scope.victory = true;
            }
        }
    }

    function getImage(node){
        $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&titles=" + node.id + "&prop=pageimages&format=json&pithumbsize=300&callback=JSON_CALLBACK").then(function(imageData){
            if(imageData.data.query.pages[Object.keys(imageData.data.query.pages)[0]].thumbnail){
                node.image = imageData.data.query.pages[Object.keys(imageData.data.query.pages)[0]].thumbnail.source;
            }
            else{
              //Put in google image search to get first image for item here!! How Swag!!
            }
        });
        visitedMap[node.id] = true;
    }
     function nodeDoubleClick(event){
        if(event.clickNode){
            $scope.continueGraph(event.clickNode.id);
        }
     }
    //This is technically repeating myself, but I am ok with that because I want the set page to be a scoped variable, meaning it needs to 
    //be a different function than the generic add nodes function
     $scope.startGraph = function(title){
        graphStart()
        $scope.gameStart(title);
        $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&titles="+ title +"&format=json&callback=JSON_CALLBACK&redirects&").then(function(data){
            $scope.ourID = Object.keys(data.data.query.pages)[0];
            $scope.ourPage = (data.data.query.pages[$scope.ourID].extract);
        }).then(function(data){
            $scope.continueGraph(title);
        });
    }
    $scope.continueGraph = function(title){
        $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&titles="+ title +"&format=json&callback=JSON_CALLBACK&redirects").then(function(data){
            basePageID = Object.keys(data.data.query.pages)[0];
            basePage = (data.data.query.pages[basePageID].extract.toLowerCase());
            baseNodeID = data.data.query.pages[basePageID].title;
            // if(baseNodeID != title){
            //     ourChart.getNode(title).id = baseNodeID;
            // }
        }).then(function(data){
            var newLinks = getLinks(basePageID)               
            $scope.pageLinks.concat(newLinks)
            });

        var getLinks = function(pageID){
            var pageLinks = [];

            $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&plnamespace=0&indexpageids=&pageids="+ pageID + "&pllimit=500&format=json&callback=JSON_CALLBACK").then(function(data){
                ourLinks = data.data.query.pages[pageID].links;
                for(var i = 0; i < ourLinks.length; i++){
                                // console.log(ourLinks[i]);
                    if (basePage.indexOf(ourLinks[i].title.toLowerCase()) != -1 && !visitedMap[ourLinks[i].title]){
                        // console.log(ourLinks[i].title)
                        pageLinks.push(ourLinks[i].title);
                        var linkData = {nodes: [{id: ourLinks[i].title, loaded: true, style: {label: ourLinks[i].title, fillColor:  "#67B486"}}],
                                       links: [{ id: ourLinks[i].title + "link", from: baseNodeID, to: ourLinks[i].title}]}; 
                        ourChart.addData(linkData);
                        numbNodes += 1;
                        }
                }
                if(data.data.continue){
                    getContinueLinks(pageID, data.data.continue.plcontinue);
                }
        });
        function getContinueLinks(pageID, nextContinue){
            var searchString = "https://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&plnamespace=0&indexpageids=&pageids="+ pageID +"&pllimit=500&plcontinue="+ nextContinue + "&format=json&callback=JSON_CALLBACK";
            $http.jsonp(searchString).success(function(data){
                // console.log(data);
                ourLinks = data.query.pages[basePageID].links;
                for(var i = 0; i < ourLinks.length; i++){
                        // console.log(ourLinks[i].title)
                            // console.log(ourLinks[i]);
                    if (basePage.indexOf(ourLinks[i].title.toLowerCase()) != -1 && !visitedMap[ourLinks[i].title]){
                        pageLinks.push(ourLinks[i].title);
                        var newNode = {id: ourLinks[i].title, loaded: true, style: {label: ourLinks[i].title, fillColor:  "#67B486" }}
                         var linkData = {nodes: [newNode],
                                   links: [{ id: ourLinks[i].title + "link", from: baseNodeID, to: ourLinks[i].title}]};
                        ourChart.addData(linkData);
                        // setInterval(function(){}, 100)
                        numbNodes += 1;
                    }
                }
                 if(data.continue){
                     getContinueLinks(pageID, data.continue.plcontinue);
                }
             });
        }
        return pageLinks;
    }
     };




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
    $scope.gameStart = function(title){
        var visitedNodes = [];
        var solutionArray = [];
        solutionArray.push(title);
        var target = findRandItem(title);

        function findRandItem(curItem){
            if(solutionArray.length>4){
                $scope.targetItem = curItem;
                $scope.solutionArray = solutionArray;
                console.log(solutionArray);
                return curItem;
            }
            else {  
                $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&prop=links|extracts&exintro=true&format=json&plnamespace=0&indexpageids=&titles="+ curItem + "&pllimit=500&format=json&callback=JSON_CALLBACK&redirects").then(function(data){
                    var activeLinks = [];
                    ourID = data.data.query.pageids[0];
                    console.log(data);
                    ourPage = data.data.query.pages[ourID].extract.toLowerCase();
                    ourLinks = data.data.query.pages[ourID].links;
                    for(var i = 0; i < ourLinks.length; i++){
                        if (ourPage.indexOf(ourLinks[i].title.toLowerCase()) != -1 && visitedNodes.indexOf(ourLinks[i].title.toLowerCase()) == -1){
                            activeLinks.push(ourLinks[i].title);
                            visitedNodes.push(ourLinks[i].title.toLowerCase());
                        }
                    }
                    var targetIndex = Math.floor(Math.random() * (activeLinks.length - 1));
                    var nextItem = activeLinks[targetIndex];
                    solutionArray.push(nextItem);
                    return findRandItem(nextItem);
                });
            }
        }
    }
    $scope.startGraph('Giant Panda');

}]);