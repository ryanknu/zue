function ZueCtrl($scope, $location, $http, DataService, ZConfig)
{
    $scope.maxGroups = 16;
    $scope.authorized = false;
    $scope.lights = DataService.lights;
    $scope.groups = DataService.groups;
    $scope.bridgeAddr = '';
    
    if ( !$scope.lights.length ) {
        $location.path('/'); // go back to loading
    }
    
    $scope.$on('DataService.update', function(event, lights) {
        $scope.lights = lights;
    })
    
    //$scope.toggleLight = function($event, light_id) {
    //    light_id = parseInt(light_id);
    //    $('#light-' + light_id).css('border-color', 'green');
    //}
}
