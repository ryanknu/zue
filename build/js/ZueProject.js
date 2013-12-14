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
        .when('/zue/light/:lightId/:action', {
            controller: 'LightCtrl',
            templateUrl: 'view/light.html'
        })
        .otherwise({ redirectTo: '/' });
})

.service('DataService', function($rootScope) {
    return {
        lights: [],
        groups: [],
        schedules: [],
        config: {},
        bridge: '',
        
        addLight:function(l) {
            this.lights[parseInt(l.id) - 1] = l;
//            $rootScope.$broadcast('DataService.update', this.lights);
        },
        
        updateLight:function(lid, nl) {
            this.lights[parseInt(lid) - 1] = nl;
//            $rootScope.$broadcast('DataService.update', this.lights);
        },
        
        setBridge:function(b) {
            this.bridge = 'http://' + b;
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
