"use strict";

(function() {
  var app = angular.module("fxgtask", []);

  app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/", {
      controller: "HomeController",
      template: "<progress class=\"center\"></progress>"
    })
  }]);
})();