function PaletteCtrl($scope, $http, ZConfig, DataService)
{
    $scope.color = '';
    
    $scope.close = function() {
        DataService.closePalettes();
    }
}
