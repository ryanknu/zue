function LoadingCtrl($scope, $location, $http, ZConfig, DataService)
{
    $scope.isAssociated = false;
    $scope.noBridgeFound = "";
    
    if ( ! $scope.isAssociated ) {
        $http.get('/api/' + ZConfig.application + '/lights')
            .success(function(data) {
                if ( typeof data === 'array' && d.error.type == 1 ) {
                    $scope.unassociated();
                }
                else {
                    $scope.associated(data);
                }
            })
            .error(function(data) {
                $scope.noBridgeFound = "We were not able to detect that this address proxies to a bridge. Please configure this and try again.";
            });
    }
    
    $scope.unassociated = function() {
        $location.path('/zue/associate');
    }
    
    $scope.associated = function(data) {
        for ( i = 1; i < 1024; i++ ) {
            var stri = i+"";
            if ( stri in data ) {
                DataService.addLight(data[stri]);
            }
            else {
                i += 1024;
            }
        }
        $location.path('/zue');
    }
}
