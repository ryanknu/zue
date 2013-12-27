function UpdateCtrl($scope, $location, $http, ZConfig, DataService)
{
    $scope.hasError = false;
    
    $http.put(DataService.bridge + '/api/' + ZConfig.application + '/config',
        { swupdate: { updatestate: 3 } })
        .success(function(data) {
            $scope.s();
        })
        .error(function(data) {
            $scope.e();
        });

    $scope.s = function() {
        $location.path('/zue');
    }
    
    $scope.e = function() {
        $scope.hasError = true;
    }
}
