angular.module('ZuePalette', [])
.directive('zueGroupPalette', function(ZConfig) {
    return {
        restrict: 'E',
        templateUrl: 'view/group-palette.html',
        scope: {
            lights: '='
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
})
.directive('zuePalette', function(ZConfig) {
    return {
        restrict: 'E',
        templateUrl: 'view/palette.html',
        scope: {
            light: '='
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
});
