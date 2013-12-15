// current time compressed
// var t = (Math.floor((new Date).getTime() / 1000)).toString(36)
// get it back to a date
// new Date(parseInt(t, 36) * 1000)

function LightCtrl($scope, $location, $http, ZConfig, DataService, $routeParams)
{
    $scope.lights = DataService.lights;
    $scope.newLight = undefined;
    $scope.lightId = $routeParams.lightId;
    $scope.action = $routeParams.action;
    $scope.arg = $routeParams.arg;
    $scope.errorMessage = "";
    $scope.actions = ['off', 'on', 'xy'];
    $scope.reqs = 0;

    if ( $scope.actions.indexOf($scope.action) > -1 ) {
        // cast types to other types
        if ( $scope.arg.substr(0, 1) == '{' || $scope.arg.substr(0, 1) == '[' ) $scope.arg = JSON.parse($scope.arg);
        if ( $scope.arg == 'off' ) $scope.arg = false;
        if ( $scope.arg == 'on' ) $scope.arg = true;
        
        var lights = $scope.lightId.split(',');
        for ( i = 0; i < lights.length; i++ ) {
            $scope.reqs ++;
            $scope.newLight = $scope.lights[parseInt(lights[i]) - 1];
            $scope.newLight.state[$scope.action] = $scope.arg;
            var obj = {};
            obj[$scope.action] = $scope.arg;
            $http.put(DataService.bridge + '/api/' + ZConfig.application + '/lights/' + lights[i] + '/state',
                JSON.stringify(obj))
                .success(function(data) {
                    $scope.goHome();
                })
                .error(function(data) {
                    $scope.errorMessage = "An error occurred while trying to update the light.";
                });
        }
    }
    
    $scope.goHome = function() {
        $scope.reqs --;
        if ( $scope.reqs == 0 ) {
            for( i = 0; i < $scope.lights.length; i++ ) {
                DataService.updateLight($scope.lights[i].id, $scope.lights[i]);
            }
            $location.path('/zue');
        }
    }
}
