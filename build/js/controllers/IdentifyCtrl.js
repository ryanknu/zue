// current time compressed
// var t = (Math.floor((new Date).getTime() / 1000)).toString(36)
// get it back to a date
// new Date(parseInt(t, 36) * 1000)

function IdentifyCtrl($scope, $location, $http, ZConfig, DataService, $routeParams)
{
    $scope.lights = DataService.lights;
    $scope.lightId = $routeParams.lightId;
    $scope.group = '';
    $scope.name = '';
    // TODO here
    $scope.aGroups = DataService.groups;
    $scope.groups = [];
    //$scope.created = (Math.floor((new Date).getTime() / 1000)).toString(36);
    
    for ( var i = 0; i < $scope.aGroups.length; i++ ) {
        $scope.groups.push( $scope.aGroups[i].name );
    }
    
    $http.put(DataService.bridge + '/api/' + ZConfig.application + '/groups/0/action', {on: false})
        .success(function() {
            $http.put(DataService.bridge + '/api/' + ZConfig.application + '/lights/' + $scope.lightId + '/state', {on: true, effect:'colorloop'});
        }); 

    // field length = 32
    // reserve 2 dividers, 6 width timestamp and 4 width timer = 20 chars max
    // group name is max 14 characters ("Living Room" is 11 chars), leaves 6 for ID
    // local name has no max length
    // group name + local name cannot exceed 20 chars
    $scope.nameMaxLength = 32 - 6 - 4 - 2;
    
    // turn off all lights but this one....
    // would be helpful :)
    
    $scope.save = function() {
        var groupName = $scope.group.substr(0,14);
        var maxLocalLen = $scope.nameMaxLength - groupName.length;
        var localName = $scope.name.substr(0, maxLocalLen);
        var eName = groupName + '/' + localName;
        $scope.lights[parseInt($scope.lightId) - 1].name = eName;
        // add on/runtime string here
        $http.put(DataService.bridge + '/api/' + ZConfig.application + '/lights/' + $scope.lightId, {name: eName})
            .success(function(data) {
                $http.put(DataService.bridge + '/api/' + ZConfig.application + '/lights/' + $scope.lightId + '/state', {on: true, effect:'none'});
                $scope.finishRequest();
            })
            .error(function(data) {
                $scope.doError();
            });
    }
    
    $scope.finishRequest = function() {
        DataService.updateLight($scope.lightId, $scope.lights[parseInt($scope.lightId) - 1]);
        $location.path('/zue');
    }
    
    $scope.doError = function() {
        alert('something went wrong');
    }
    
    $scope.preview = function() {
        $scope.pgroup = $scope.group.substr(0,14);
        var maxLocalLen = $scope.nameMaxLength - $scope.pgroup.length;
        $scope.plocal = $scope.name.substr(0, maxLocalLen);
    }
    
    $scope.setGroup = function(a) {
        $scope.group = a;
    }
}
