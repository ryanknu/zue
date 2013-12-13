angular.module('zue-project', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'LoadingCtrl',
            templateUrl: 'view/loading.html'
        })
        .when('/zue', {
            controller: 'ZueCtrl',
            templateUrl: 'view/dashboard.html'
        })
        .when('/zue/associate', {
            controller: 'AssociateCtrl',
            templateUrl: 'view/associate.html'
            
        })
        .otherwise({ redirectTo: '/' });
})

.service('DataService', function($rootScope) {
    return {
        lights: [],
        groups: [],
        schedules: [],
        config: {},
        
        addLight:function(l) {
            this.lights.push(l);
            $rootScope.$broadcast('DataService.update', this.lights);
        }
    };
})

.factory('ZConfig', function() {
    return {
        application: 'ZulworksZue'
    };
});

//.factory('Lights', function() {
//
//});

//.controller('ZueCtrl', function($scope) {
//    
//})
