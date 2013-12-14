function LightCtrl($scope, $location, $http, ZConfig, DataService, $routeParams)
{
    $scope.lights = DataService.lights;
    $scope.newLight = undefined;
    $scope.lightId = $routeParams.lightId;
    $scope.action = $routeParams.action;
    $scope.errorMessage = "";
    
    if ( $scope.action == 'off' || $scope.action == 'on' ) {
        // turn off
        var on = $scope.action == 'on';
        $scope.newLight = $scope.lights[parseInt($scope.lightId) - 1];
        $scope.newLight.state.on = on;
        $http.put(DataService.bridge + '/api/' + ZConfig.application + '/lights/' + $scope.lightId + '/state',
            JSON.stringify({on: on}))
            .success(function(data) {
                $scope.goHome();
            })
            .error(function(data) {
                $scope.errorMessage = "An error occurred while trying to update the light.";
            });
    }
    
    $scope.goHome = function() {
        DataService.updateLight($scope.lightId, $scope.newLight);
        $location.path('/zue');
    }
}
