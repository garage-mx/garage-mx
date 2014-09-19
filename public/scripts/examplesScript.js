(function(){
	var exampleApp1 = angular.module("exampleApp1",[]);
	var remCharsController = function($scope){
		$scope.message = "";

		$scope.remaining= function () {
			return 100 - $scope.message.length;
		};
		$scope.shouldWarn= function () {
			return $scope.remaining() < 10;
		};
		$scope.clear = function(){
			$scope.message = "";
		}
	}
	exampleApp1.controller("remCharsController",['$scope',remCharsController]);

}());