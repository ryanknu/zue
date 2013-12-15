function ZueCtrl($scope, $location, $http, DataService, ZConfig)
{
    $scope.maxGroups = 16;
    $scope.authorized = false;
    $scope.lights = DataService.lights;
    $scope.groups = DataService.groups;
    $scope.bridgeAddr = '';
    $scope.allLights = [];
    $scope.groupColors = ['#ff0000', '#00ff00', '#0000ff'];
    
    // group colors
    for ( var i = 0; i < $scope.groups.length; i++ ) {
        $scope.groups[i].color = $scope.groupColors[i];
        for ( var y = 0; y < $scope.groups[i].lights.length; y++ ) {
            $scope.lights[parseInt($scope.groups[i].lights[y]) - 1].zhue_groupcolor = $scope.groups[i].color;
        }
    }
    
    for( var i = 0; i < $scope.lights.length; i++ ) {
        $scope.allLights.push($scope.lights[i].id);
    }
    $scope.allLights = $scope.allLights.join(',');
    
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
