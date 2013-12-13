function LoadingCtrl($scope, $location, $http, ZConfig, DataService)
{
    $scope.isAssociated = false;
    $scope.noBridgeFound = "";
    
    if ( ! $scope.isAssociated ) {
        $http.get('/api/' + ZConfig.application)
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
        var lights = data.lights;
        for ( i = 1; i < 1024; i++ ) {
            var stri = i+"";
            if ( stri in lights ) {
                var l = lights[stri];
                var rgb = colorConverter.xyBriToRgb({
                      x: l.state.xy[0],
                      y: l.state.xy[1],
                    bri: (l.state.bri / 255.0)
                });
                
                lights[stri].id = i;
                lights[stri].zhue_color = {};
                lights[stri].zhue_color.hex = '#' + colorConverter.rgbToHexString(rgb);
                lights[stri].zhue_color.r = rgb.r;
                lights[stri].zhue_color.g = rgb.g;
                lights[stri].zhue_color.b = rgb.b;
                DataService.addLight(lights[stri]);
            }
            else {
                i += 1024;
            }
        }
        $location.path('/zue');
    }
}
