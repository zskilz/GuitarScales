define(['require','angular'],function(require,angular){


  var app = angular.module('guitarScalesDemo', [])
  .controller('guitarScalesDemoMain', function($scope) {
    $scope.greeting = 'Welcome!';
  });

  return app;

})