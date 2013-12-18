function LoadingCtrl($scope, $location, $http, ZConfig, DataService)
{
    $scope.isAssociated = false;
    $scope.noBridgeFound = "";
    
    if ( ! $scope.isAssociated ) {
        $http.get('http://www.meethue.com/api/nupnp')
        .success(function(data) {
            if ( data.length == 1 ) {
                $scope.setBridge(data[0].internalipaddress);
                $http.get(DataService.bridge + '/api/' + ZConfig.application)
                    .success(function(data) {
                        if ( typeof data === 'array' && d.error.type == 1 ) {
                            $scope.unassociated();
                        }
                        else {
                            $scope.associated(data);
                        }
                    })
                    .error(function(data) {
                        $scope.noBridge();
                    });
            }
            else {
                $scope.noBridge();
            }
        })        
        .error(function(data) {
            // TODO: manual bridge mode
            $scope.noBridgeFound = "You are not connected to the Internet. This is a problem because manual bridge mode is not yet supported.";
        });
    }
    
    $scope.setBridge = function(bridge) {
        DataService.setBridge(bridge);
    }
    
    $scope.noBridge = function() {
        $scope.noBridgeFound = "We were not able to detect a Hue bridge on this network.";
    }
    
    $scope.unassociated = function() {
        $location.path('/zue/associate');
    }
    
    $scope.associated = function(data) {
        var lights = data.lights;
        for ( var i = 1; i < 1024; i++ ) {
            var stri = i+"";
            if ( stri in lights ) {
                var l = lights[stri];
                lights[stri].id = i;
                lights[stri].palette_visible = false;
                DataService.addLight(lights[stri]);
            }
            else {
                i += 1024;
            }
        }
        $location.path('/zue');
    }
}
