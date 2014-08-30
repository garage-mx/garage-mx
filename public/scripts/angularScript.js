(function(){

	var productsApp = angular.module("productsApp",["angularFileUpload", "textAngular", "ng-currency", "ngTagsInput"]);
	productsApp.controller("UploaderController", ["$scope", "FileUploader", function($scope, FileUploader) {
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
	productsApp.controller("FormController", FormController);


    // Data Table
    var appMainTables = angular.module('mainTables', ['ngTable']).
    controller('TablesCtrl', ['$scope', '$filter', '$http', 'ngTableParams', function($scope, $filter, $http, ngTableParams) {
        var storedData = new Array();

        var promiseFailed = function(data, status, headers, config){
            $scope.statusMsg = "Error: " + status;
        };

        var getData = function($defer, params) {
            if(storedData.length === 0){
                var promiseSuccess =  function(data, status, headers, config){
                    storedData = data.data; 
                    $scope.statusMsg = "Datos obtenidos satisfactoriamente";
                    // use build-in angular filter
                    var filteredData = params.filter() ? $filter('filter')(data.data, params.filter()) : data.data;
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data.data; 
                    // update table params
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    console.log(data.data);
                };
                // ajax request to data source Path
                $http.get($scope.dataSource).then(promiseSuccess, promiseFailed);
            }
            else {
                $scope.statusMsg = "Consultando datos almacenados localmente";
                var filteredData = params.filter() ? $filter('filter')(storedData, params.filter()) : storedData;
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : storedData; 
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: 0, // length of data is updated by params.total();
            getData: getData
        });
    }]);

}());


