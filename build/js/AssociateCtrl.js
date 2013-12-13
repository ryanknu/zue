function AssociateCtrl($scope, $location, $http, ZConfig)
{
    $scope.message = 'Click the associate button to link to bridge.';
    
    $scope.tryAssoc = function() {
        $scope.message = 'Dispatching..';
        $http.post('/api', JSON.stringify({devicetype:'zulworkswebapp', username: ZConfig.application}))
            .success(function(data) {
                var d = data[0];
                if ( 'error' in d && d.error.type == 101 ) {
                    $scope.message = 'The bridge was not ready for association. Try again.';
                }
                else if ( 'error' in d ) {
                    $scope.message = 'Some error occurred on the bridge. Inspect the http requests.';
                }
                else {
                    $scope.associated();
                }
            });
    }
    
    $scope.associated = function() {
        $location.path('/zue');
    }
}
