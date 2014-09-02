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

    //Modals
    var myModalsApp = angular.module('myModule', ['ui.bootstrap']);
    myModalsApp.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function (size) {
            var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: ModalInstanceCtrl, // llamada al funcion con ese nombre
              size: size,
              resolve: {
                items: function () {
                  return $scope.items;
                }
              }
            });
            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.modal = function (url, itemID) {
            $scope.updatePath = url + itemID + "";

            var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: ModalInstanceCtrl, // Call to the function with the same name outside the controller
              size: "lg",
              resolve: {
                updatePath: function(){ // If you want to send an other parameter you should add it to ModalInstanceCtrl function
                    console.log($scope.updatePath);
                    return $scope.updatePath;
                },
                items: function () {
                    return $scope.items;
                }
              }
            });
            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }]);

    var ModalInstanceCtrl = function ($scope, $modalInstance, items, updatePath) {
      $scope.items = items;
      $scope.updatePath = updatePath;
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    angular.module("ProductsListApp",["mainTables","myModule"]);
    
    // Prueba con select en cascada
    var cascadeApp = angular.module('cascadeModule', []);
    var cascadeController = function($scope, $http){
        $http.get("/products/categorias_JSON").then(function(response){ 
            $scope.categorias = response.data;
        },failure);
        
        $scope.getProductos = function(id){
            $http.get("/products/productos_JSON?id_categoria="+id).then(success,failure);
        }
        var success = function(response){
            $scope.productos = response.data;
        }
        var failure = function(error){
            console.log(error);
        }
    }
    cascadeApp.controller("cascadeController", cascadeController);

}());


