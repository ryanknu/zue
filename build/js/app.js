angular.module('$zue.directives', []);
angular.module('zue-project', ['ngRoute', '$zue.directives'])

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
        .when('/zue/read', {
            controller: 'ReadCtrl',
            templateUrl: 'view/read.html'
        })
        .otherwise({ redirectTo: '/zue' });
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
        
        addGroup:function(gr, lightId, col) {
            var found = false;
            for ( var i = 0; i < this.groups.length; i++ ) {
                if ( this.groups[i].name == gr ) {
                    found = true;
                    break;
                }
            }
            if ( !found ) {
                this.groups.push({name: gr, lights:[lightId], colors:[col], palette_visible:false});
            }
            else {
                if ( this.groups[i].lights.indexOf(lightId) < 0 ) {
                    this.groups[i].lights.push(lightId);
                    this.groups[i].colors.push(col);
                }
            }
        },
        
        closePalettes:function() {
            for( var i = 0; i < this.lights.length; i++ ) {
                this.lights[i].palette_visible = false;
            }
            for( var i = 0; i < this.groups.length; i++ ) {
                this.groups[i].palette_visible = false;
            }
            $rootScope.$broadcast('DataService.closePalettes');
        },
        
        stickPalette:function(paletteType, index) {
            this.closePalettes();
            if ( paletteType == 'group' ) {
                this.groups[index].palette_visible = true;
            }
            else {
                this.lights[index].palette_visible = true;
            }
        },
        
        fixColor:function(lid) {
            var l = this.lights[parseInt(lid) - 1];
            var rgb = colorConverter.xyBriToRgb({
                  x: l.state.xy[0],
                  y: l.state.xy[1],
                  bri:1,
//                bri: (l.state.bri / 255.0)
            });
            
            this.lights[parseInt(lid) - 1].zhue_last_turned_on = 'Never';
            this.lights[parseInt(lid) - 1].zhue_seconds_on = 0;
            this.lights[parseInt(lid) - 1].zhue_name = 'No name';
            this.lights[parseInt(lid) - 1].zhue_group = 'No group';
            
            this.lights[parseInt(lid) - 1].zhue_color = {};
            this.lights[parseInt(lid) - 1].zhue_color.hex = '#' + colorConverter.rgbToHexString(rgb);
            this.lights[parseInt(lid) - 1].zhue_color.r = rgb.r;
            this.lights[parseInt(lid) - 1].zhue_color.g = rgb.g;
            this.lights[parseInt(lid) - 1].zhue_color.b = rgb.b;
            
            var names = l.name.split('/');
            if ( names.length > 2 ) {
                var p = names[2].match(/.{1,6}/g);
                this.lights[parseInt(lid) - 1].zhue_last_turned_on = new Date(parseInt(p[0], 36) * 1000);
                this.lights[parseInt(lid) - 1].zhue_seconds_on = new Date(parseInt(p[1], 36) * 1000);
            }
            if ( names.length > 1 ) {
                this.lights[parseInt(lid) - 1].zhue_group = names[0];
                this.lights[parseInt(lid) - 1].zhue_name = names[1];
                this.addGroup(names[0], lid, this.lights[parseInt(lid) - 1].zhue_color.hex);
            }
            else {
                this.lights[parseInt(lid) - 1].zhue_name = names[0];
            }
        },
        
        setBridge:function(b) {
            this.bridge = 'http://' + b;
        }
    };
})

.factory('ZConfig', function() {
    return {
        application: 'ZulworksZue',
        manualBridge: '10.0.1.27',
        whites: [
            { name: 'The Sun',  ct: 500, hex:'#aaaaaa' },
            { name: 'Orangey',  ct: 420, hex:'#aaaaaa' },
            { name: 'Reading',  ct: 343, hex:'#aaaaaa' },
            { name: 'Neutral',  ct: 213, hex:'#aaaaaa' },
            { name: 'Energize', ct: 153, hex:'#aaaaaa' }
        ],
        colors:[
            { xy: '[0.2093,0.0643]', hex:'#a307eb', wtext:true, name: 'Royal' },
            { xy: '[0.2476,0.0856]', hex:'#b900ff', wtext:false, name: 'Electric Violet' },
            { xy: '[0.1778,0.0603]', hex:'#3c07fa', wtext:false, name: 'Blue' },
            { xy: '[0.3889,0.4783]', hex:'#00ff00', wtext:true, name: 'Lime' },
            { xy: '[0.6161,0.3297]', hex:'#e88770', wtext:true, name: 'Salmon' },
            { xy: '[0.5292,0.2419]', hex:'#ea478b', wtext:false, name: 'Fuscia' },
            { xy: '[0.3758,0.1568]', hex:'#fe016b', wtext:true, name: 'Super Pink' },
            { xy: '[0.6736,0.3221]', hex:'#ff0000', wtext:true, name: 'Red' },
            { xy: '[0.6195,0.3617]', hex:'#ec9a36', wtext:true, name: 'Orange' },
            { xy: '[0.5337,0.4248]', hex:'#ffdd01', wtext:true, name: 'Marigold' },
        ]
    };
});

//.factory('Lights', function() {
//
//});

//.controller('ZueCtrl', function($scope) {
//    
//})
