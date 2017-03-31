angular.module("docs",[])
.controller("docController",["$scope",function($scope){
    $scope.api=require("./data/api.json");
    console.info($scope.api);

}]);