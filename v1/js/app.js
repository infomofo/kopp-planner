angular.module('koppPlanner', [], function($locationProvider) {
  $locationProvider.html5Mode(true);
});

angular.module('koppPlanner', ['ui.bootstrap','ui']).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});