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
        .when('/zue/light/:lightId/:action/:arg', {
            controller: 'LightCtrl',
            templateUrl: 'view/light.html'
        })
        .when('/zue/identify/:lightId', {
            controller: 'IdentifyCtrl',
            templateUrl: 'view/identify.html'
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
            this.fixColor(l.id);
//            $rootScope.$broadcast('DataService.update', this.lights);
        },
        
        updateLight:function(lid, nl) {
            this.lights[parseInt(lid) - 1] = nl;
            this.fixColor(lid);
//            $rootScope.$broadcast('DataService.update', this.lights);
        },
        
        addGroup:function(gr, lightId) {
            var found = false;
            for ( var i = 0; i < this.groups.length; i++ ) {
                if ( this.groups[i].name == gr ) {
                    found = true;
                    break;
                }
            }
            if ( !found ) {
                this.groups.push({name: gr, lights:[lightId]});
            }
            else {
                this.groups[i].lights.push(lightId);
            }
        },
        
        fixColor:function(lid) {
            var l = this.lights[parseInt(lid) - 1];
            var rgb = colorConverter.xyBriToRgb({
                  x: l.state.xy[0],
                  y: l.state.xy[1],
                bri: (l.state.bri / 255.0)
            });
            
            this.lights[parseInt(lid) - 1].zhue_last_turned_on = 'Never';
            this.lights[parseInt(lid) - 1].zhue_seconds_on = 0;
            this.lights[parseInt(lid) - 1].zhue_name = 'No name';
            this.lights[parseInt(lid) - 1].zhue_group = 'No group';
            
            var names = l.name.split('/');
            if ( names.length > 2 ) {
                var p = names[2].match(/.{1,6}/g);
                this.lights[parseInt(lid) - 1].zhue_last_turned_on = new Date(parseInt(p[0], 36) * 1000);
                this.lights[parseInt(lid) - 1].zhue_seconds_on = new Date(parseInt(p[1], 36) * 1000);
            }
            if ( names.length > 1 ) {
                this.lights[parseInt(lid) - 1].zhue_group = names[0];
                this.lights[parseInt(lid) - 1].zhue_name = names[1];
                this.addGroup(names[0], lid);
            }
            else {
                this.lights[parseInt(lid) - 1].zhue_name = names[0];
            }
            
            this.lights[parseInt(lid) - 1].zhue_color = {};
            this.lights[parseInt(lid) - 1].zhue_color.hex = '#' + colorConverter.rgbToHexString(rgb);
            this.lights[parseInt(lid) - 1].zhue_color.r = rgb.r;
            this.lights[parseInt(lid) - 1].zhue_color.g = rgb.g;
            this.lights[parseInt(lid) - 1].zhue_color.b = rgb.b;
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
