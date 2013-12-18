function LoadingCtrl($scope, $location, $http, ZConfig, DataService) {
    $scope.isAssociated = false;
    $scope.noBridgeFound = "";
    if (!$scope.isAssociated) {
        $http.get("http://www.meethue.com/api/nupnp").success(function(data) {
            if (data.length == 1) {
                $scope.setBridge(data[0].internalipaddress);
                $http.get(DataService.bridge + "/api/" + ZConfig.application).success(function(data) {
                    if (typeof data === "array" && d.error.type == 1) {
                        $scope.unassociated();
                    } else {
                        $scope.associated(data);
                    }
                }).error(function(data) {
                    $scope.noBridge();
                });
            } else {
                $scope.noBridge();
            }
        }).error(function(data) {
            $scope.noBridgeFound = "You are not connected to the Internet. This is a problem because manual bridge mode is not yet supported.";
        });
    }
    $scope.setBridge = function(bridge) {
        DataService.setBridge(bridge);
    };
    $scope.noBridge = function() {
        $scope.noBridgeFound = "We were not able to detect a Hue bridge on this network.";
    };
    $scope.unassociated = function() {
        $location.path("/zue/associate");
    };
    $scope.associated = function(data) {
        var lights = data.lights;
        for (var i = 1; i < 1024; i++) {
            var stri = i + "";
            if (stri in lights) {
                var l = lights[stri];
                lights[stri].id = i;
                lights[stri].palette_visible = false;
                DataService.addLight(lights[stri]);
            } else {
                i += 1024;
            }
        }
        $location.path("/zue");
    };
}

function ZueCtrl($scope, $location, $http, DataService, ZConfig) {
    $scope.maxGroups = 16;
    $scope.authorized = false;
    $scope.lights = DataService.lights;
    $scope.groups = DataService.groups;
    $scope.bridgeAddr = "";
    $scope.allLights = [];
    $scope.groupColors = [ "#ff0000", "#00ff00", "#0000ff" ];
    $scope.whites = ZConfig.whites;
    $scope.colors = ZConfig.colors;
    $http.put(DataService.bridge + "/api/" + ZConfig.application + "/groups/0/action", {
        effect: "none"
    });
    for (var i = 0; i < $scope.groups.length; i++) {
        $scope.groups[i].color = $scope.groupColors[i];
        for (var y = 0; y < $scope.groups[i].lights.length; y++) {
            $scope.lights[parseInt($scope.groups[i].lights[y]) - 1].zhue_groupcolor = $scope.groups[i].color;
        }
    }
    for (var i = 0; i < $scope.lights.length; i++) {
        $scope.allLights.push($scope.lights[i].id);
    }
    $scope.allLights = $scope.allLights.join(",");
    if (!$scope.lights.length) {
        $location.path("/");
    }
    $scope.$on("DataService.update", function(event, lights) {
        $scope.lights = lights;
    });
    $scope.clearAllPalettes = function() {
        for (var i = 0; i < $scope.lights.length; i++) {
            $scope.lights[i].palette_visible = false;
        }
        for (var i = 0; i < $scope.groups.length; i++) {
            $scope.groups[i].palette_visible = false;
        }
    };
    $scope.showPalette = function(t_i) {
        $scope.clearAllPalettes();
        $scope.lights[t_i].palette_visible = true;
        DataService.stickPalette("light", t_i);
    };
    $scope.showGroupPalette = function(t_i) {
        $scope.clearAllPalettes();
        $scope.groups[t_i].palette_visible = true;
        DataService.stickPalette("group", t_i);
    };
}

function AssociateCtrl($scope, $location, $http, ZConfig, DataService) {
    $scope.message = "Click the associate button to link to bridge.";
    $scope.tryAssoc = function() {
        $scope.message = "Dispatching..";
        $http.post(DataService.bridge + "/api", JSON.stringify({
            devicetype: "zulworkswebapp",
            username: ZConfig.application
        })).success(function(data) {
            var d = data[0];
            if ("error" in d && d.error.type == 101) {
                $scope.message = "The bridge was not ready for association. Try again.";
            } else if ("error" in d) {
                $scope.message = "Some error occurred on the bridge. Inspect the http requests.";
            } else {
                $scope.associated();
            }
        });
    };
    $scope.associated = function() {
        $location.path("/zue");
    };
}

function LightCtrl($scope, $location, $http, ZConfig, DataService, $routeParams) {
    $scope.lights = DataService.lights;
    $scope.newLight = undefined;
    $scope.lightId = $routeParams.lightId;
    $scope.action = $routeParams.action;
    $scope.arg = $routeParams.arg;
    $scope.errorMessage = "";
    $scope.actions = [ "off", "on", "xy", "ct", "bri" ];
    $scope.reqs = 0;
    if ($scope.actions.indexOf($scope.action) > -1) {
        if ($scope.arg.substr(0, 1) == "{" || $scope.arg.substr(0, 1) == "[") $scope.arg = JSON.parse($scope.arg);
        if ($scope.arg == "off") $scope.arg = false;
        if ($scope.arg == "on") $scope.arg = true;
        if ($scope.action == "ct" || $scope.action == "bri") $scope.arg = JSON.parse($scope.arg);
        var lights = $scope.lightId.split(",");
        for (i = 0; i < lights.length; i++) {
            $scope.reqs++;
            $scope.newLight = $scope.lights[parseInt(lights[i]) - 1];
            $scope.newLight.state[$scope.action] = $scope.arg;
            var obj = {};
            obj[$scope.action] = $scope.arg;
            $http.put(DataService.bridge + "/api/" + ZConfig.application + "/lights/" + lights[i] + "/state", JSON.stringify(obj)).success(function(data) {
                $scope.goHome();
            }).error(function(data) {
                $scope.errorMessage = "An error occurred while trying to update the light.";
            });
        }
    }
    $scope.goHome = function() {
        $scope.reqs--;
        if ($scope.reqs == 0) {
            for (i = 0; i < $scope.lights.length; i++) {
                DataService.updateLight($scope.lights[i].id, $scope.lights[i]);
            }
            $location.path("/zue");
        }
    };
}

function IdentifyCtrl($scope, $location, $http, ZConfig, DataService, $routeParams) {
    $scope.lights = DataService.lights;
    $scope.lightId = $routeParams.lightId;
    $scope.group = "";
    $scope.name = "";
    $scope.aGroups = DataService.groups;
    $scope.groups = [];
    for (var i = 0; i < $scope.aGroups.length; i++) {
        $scope.groups.push($scope.aGroups[i].name);
    }
    $http.put(DataService.bridge + "/api/" + ZConfig.application + "/groups/0/action", {
        on: false
    }).success(function() {
        $http.put(DataService.bridge + "/api/" + ZConfig.application + "/lights/" + $scope.lightId + "/state", {
            on: true,
            effect: "colorloop"
        });
    });
    $scope.nameMaxLength = 32 - 6 - 4 - 2;
    $scope.save = function() {
        var groupName = $scope.group.substr(0, 14);
        var maxLocalLen = $scope.nameMaxLength - groupName.length;
        var localName = $scope.name.substr(0, maxLocalLen);
        var eName = groupName + "/" + localName;
        $scope.lights[parseInt($scope.lightId) - 1].name = eName;
        $http.put(DataService.bridge + "/api/" + ZConfig.application + "/lights/" + $scope.lightId, {
            name: eName
        }).success(function(data) {
            $http.put(DataService.bridge + "/api/" + ZConfig.application + "/lights/" + $scope.lightId + "/state", {
                on: true,
                effect: "none"
            });
            $scope.finishRequest();
        }).error(function(data) {
            $scope.doError();
        });
    };
    $scope.finishRequest = function() {
        DataService.updateLight($scope.lightId, $scope.lights[parseInt($scope.lightId) - 1]);
        $location.path("/zue");
    };
    $scope.doError = function() {
        alert("something went wrong");
    };
    $scope.preview = function() {
        $scope.pgroup = $scope.group.substr(0, 14);
        var maxLocalLen = $scope.nameMaxLength - $scope.pgroup.length;
        $scope.plocal = $scope.name.substr(0, maxLocalLen);
    };
    $scope.setGroup = function(a) {
        $scope.group = a;
    };
}

angular.module("zue-project", [ "ngRoute", "ZuePalette" ]).config(function($routeProvider) {
    $routeProvider.when("/", {
        controller: "LoadingCtrl",
        templateUrl: "view/loading.html"
    }).when("/zue", {
        controller: "ZueCtrl",
        templateUrl: "view/dashboard.html"
    }).when("/zue/associate", {
        controller: "AssociateCtrl",
        templateUrl: "view/associate.html"
    }).when("/zue/light/:lightId/:action/:arg", {
        controller: "LightCtrl",
        templateUrl: "view/light.html"
    }).when("/zue/identify/:lightId", {
        controller: "IdentifyCtrl",
        templateUrl: "view/identify.html"
    }).otherwise({
        redirectTo: "/"
    });
}).service("DataService", function($rootScope) {
    return {
        lights: [],
        groups: [],
        schedules: [],
        config: {},
        bridge: "",
        addLight: function(l) {
            this.lights[parseInt(l.id) - 1] = l;
            this.fixColor(l.id);
        },
        updateLight: function(lid, nl) {
            this.lights[parseInt(lid) - 1] = nl;
            this.fixColor(lid);
        },
        addGroup: function(gr, lightId, model) {
            var found = false;
            for (var i = 0; i < this.groups.length; i++) {
                if (this.groups[i].name == gr) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.groups.push({
                    name: gr,
                    lights: [ lightId ],
                    models: [ model ],
                    palette_visible: false
                });
            } else {
                if (this.groups[i].lights.indexOf(lightId) < 0) {
                    this.groups[i].lights.push(lightId);
                    this.groups[i].models.push(model);
                }
            }
        },
        closePalettes: function() {
            for (var i = 0; i < this.lights.length; i++) {
                this.lights[i].palette_visible = false;
            }
            for (var i = 0; i < this.groups.length; i++) {
                this.groups[i].palette_visible = false;
            }
        },
        stickPalette: function(paletteType, index) {
            this.closePalettes();
            if (paletteType == "group") {
                this.groups[index].palette_visible = true;
            } else {
                this.lights[index].palette_visible = true;
            }
        },
        fixColor: function(lid) {
            var l = this.lights[parseInt(lid) - 1];
            var rgb = colorConverter.xyBriToRgb({
                x: l.state.xy[0],
                y: l.state.xy[1],
                bri: l.state.bri / 255
            });
            this.lights[parseInt(lid) - 1].zhue_last_turned_on = "Never";
            this.lights[parseInt(lid) - 1].zhue_seconds_on = 0;
            this.lights[parseInt(lid) - 1].zhue_name = "No name";
            this.lights[parseInt(lid) - 1].zhue_group = "No group";
            var names = l.name.split("/");
            if (names.length > 2) {
                var p = names[2].match(/.{1,6}/g);
                this.lights[parseInt(lid) - 1].zhue_last_turned_on = new Date(parseInt(p[0], 36) * 1e3);
                this.lights[parseInt(lid) - 1].zhue_seconds_on = new Date(parseInt(p[1], 36) * 1e3);
            }
            if (names.length > 1) {
                this.lights[parseInt(lid) - 1].zhue_group = names[0];
                this.lights[parseInt(lid) - 1].zhue_name = names[1];
                this.addGroup(names[0], lid, this.lights[parseInt(lid) - 1].modelid);
            } else {
                this.lights[parseInt(lid) - 1].zhue_name = names[0];
            }
            this.lights[parseInt(lid) - 1].zhue_color = {};
            this.lights[parseInt(lid) - 1].zhue_color.hex = "#" + colorConverter.rgbToHexString(rgb);
            this.lights[parseInt(lid) - 1].zhue_color.r = rgb.r;
            this.lights[parseInt(lid) - 1].zhue_color.g = rgb.g;
            this.lights[parseInt(lid) - 1].zhue_color.b = rgb.b;
        },
        setBridge: function(b) {
            this.bridge = "http://" + b;
        }
    };
}).factory("ZConfig", function() {
    return {
        application: "ZulworksZue",
        manualBridge: "10.0.1.27",
        whites: [ {
            name: "The Sun",
            ct: 500,
            hex: "#aaaaaa"
        }, {
            name: "Orangey",
            ct: 420,
            hex: "#aaaaaa"
        }, {
            name: "Reading",
            ct: 343,
            hex: "#aaaaaa"
        }, {
            name: "Neutral",
            ct: 213,
            hex: "#aaaaaa"
        }, {
            name: "Energize",
            ct: 153,
            hex: "#aaaaaa"
        } ],
        colors: [ {
            xy: "[0.3889,0.4783]",
            hex: "#00ff00",
            name: "Lime"
        }, {
            xy: "[0.6736,0.3221]",
            hex: "#ff0000",
            name: "Red"
        }, {
            xy: "[0.2093,0.0643]",
            hex: "#a307eb",
            name: "Royal"
        } ]
    };
});

angular.module("ZuePalette", []).directive("zueGroupPalette", function(ZConfig) {
    return {
        restrict: "E",
        templateUrl: "view/group-palette.html",
        scope: {
            lights: "="
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
}).directive("zuePalette", function(ZConfig) {
    return {
        restrict: "E",
        templateUrl: "view/palette.html",
        scope: {
            light: "="
        },
        link: function(scope, element, attr) {
            scope.colors = ZConfig.colors;
            scope.whites = ZConfig.whites;
        }
    };
});