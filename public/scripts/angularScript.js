(function(){
	var app = angular.module("uploadFiles", ['angularFileUpload']);

	var MainController = function($scope, $http, $upload){
		$scope.statusMsg = "Seleccione una imagen";

		var uploadSuccess =  function(data, status, headers, config){
			// file is uploaded successfully
		    $scope.statusMsg = "Transferencia satisfactoria";
		    $scope.imageUrl = data.data.thumbPath;
		};
		var uploadFailed = function(data, status, headers, config){
			$scope.statusMsg = "Error: " + status;
		};

		$scope.onFileSelect = function($files) {
		    //$files: an array of files selected, each file has name, size, and type.
		    for (var i = 0; i < $files.length; i++) {
				var $file = $files[i];
		    	$upload.upload({
		        	url: '/products/photos',
		        	headers: {'Content-Type': 'multipart/form-data'},
		        	file: $file,
		        	progress: function(e){}
		      	}).then(uploadSuccess, uploadFailed);
		    }
		};
	};

	app.controller("MainController", MainController)
}());