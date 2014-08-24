(function(){
	var app = angular.module("uploadFiles",["angularFileUpload"])
	.controller('UploaderController', function($scope, FileUploader) {
        $scope.uploader = new FileUploader({url: '/products/photos'});
    });
	
	var MainController = function($scope, $http){
		$scope.statusMsg = "Seleccione una imagen";

		var uploadSuccess =  function(data, status, headers, config){
			// file is uploaded successfully
		    $scope.statusMsg = "Transferencia satisfactoria";
		    $scope.imageUrl = data.data.thumbPath;
		};
		var uploadFailed = function(data, status, headers, config){
			$scope.statusMsg = "Error: " + status;
		};

	};

	app.controller("MainController", MainController)
}());