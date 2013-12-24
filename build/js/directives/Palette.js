angular.module('$zue.directives')
.directive('zueGroupPalette', function(ZConfig) {
    return {
        restrict: 'E',
        templateUrl: 'view/group-palette.html',
        scope: {
            lights: '=',
            eventHandler: '&ngClick'
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
});
angular.module('$zue.directives')
.directive('zuePalette', function(ZConfig) {
    return {
        restrict: 'E',
        templateUrl: 'view/palette.html',
        scope: {
            light: '=',
            eventHandler: '&ngClick'
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
});
