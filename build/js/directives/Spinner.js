angular.module('$zue.directives')
.directive('spinner', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'view/spinner.html',
        link: function(scope, element, attr) {
            $timeout(function() {
                var bWidth = 10;
                var bHeight = 20;
                var radius = 20;
                var bars = 3;

                var c=document.getElementById("spinnerc");
                var ctx=c.getContext("2d");

                ctx.fillStyle = '#FFF';

                // move to center of canvas
                ctx.translate(24,24);

                // offset width of object and radius
                //ctx.translate( 0 - (bWidth / 2), radius );


                for ( var i = 0; i < bars; i++ ) {
                    ctx.fillRect(0,0,bWidth,bHeight);
                    ctx.rotate( (Math.PI / 180) * (360 / bars) );
                }
            }, 0);
        }
    }
});