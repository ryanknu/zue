function ZueCtrl($scope, $location, $http, DataService, ZConfig)
{
    $scope.maxGroups = 16;
    $scope.authorized = false;
    $scope.lights = DataService.lights;
    
    if ( !$scope.lights.length ) {
        $location.path('/'); // go back to loading
    }
    
    $scope.$on('DataService.update', function(event, lights) {
        $scope.lights = lights;
    })
}
