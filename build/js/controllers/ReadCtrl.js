// Read Lights
function ReadCtrl($scope, $http, ZConfig, DataService)
{
    $scope.error = "";
    $scope.string = "";
    $scope.lights = [];
    
    $http.get(DataService.bridge + '/api/' + ZConfig.application)
        .success(function(data) {
            if ( typeof data === 'object' ) {
                $scope.associated(data);
            }
            else {
                $scope.associated(data);
            }
        })
        .error(function(data) {
            $scope.error = "Something went wrong. Cannot read lights.";
        });
    
    $scope.associated = function(data) {
        var o = [];
        $scope.string = "what up";
        var lights = data.lights;
        for ( var i = 1; i < 1024; i++ ) {
            var stri = i+"";
            if ( stri in lights ) {
                var l = lights[stri];
                $scope.lights.push(l);
                o.push({
                    xy: l.state.xy || 'error',
                    hex: '#aaa',
                    name: 'blah',
                    wtext: true
                });
            }
            else {
                i += 1024;
            }
        }
        $scope.string = JSON.stringify(o).replace('},', '},\n');
    };
}
