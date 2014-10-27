require.config({
  shim: {
    angular: {
      exports: "angular"
    }
  },
  paths: {
    require: "/app/components/requirejs/require.js",
    angular: "/app/components/angular/angular.min"
  }
})

define(['require', 'angular', 'app','guitarScales'], function(require, angular) {
 
  angular.bootstrap(document, ['guitarScalesDemo']);

})
