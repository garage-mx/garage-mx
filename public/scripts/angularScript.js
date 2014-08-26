(function(){
	var app = angular.module("productsApp",["angularFileUpload", "textAngular", "ng-currency", "ngTagsInput"]);

	app.controller("UploaderController", ["$scope", "FileUploader", function($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({url: '/products/photos'});
		
		// FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            fileItem.imageUrl = response.thumbPath;
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };

        var controller = $scope.controller = {
            isImage: function(item) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };
    }]);
	
	var FormController = function($scope, $http){

        $scope.price = 0;
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
	app.controller("FormController", FormController);

}());