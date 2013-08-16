"use strict";

window.title = function(titleHTML) {
  document.getElementById("title").innerHTML = titleHTML ? titleHTML : "FireGTask";
};

window.paramify = function(obj) {
  var str = [];
  for(var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

  return str.join("&");
};

(function() {
  var app = angular.module("fxgtask", []);

  app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '!';

    var tasklist = {
      controller: "TasksController",
      templateUrl: "partials/tasklist.html"
    };

    $routeProvider.when("/", tasklist);
    $routeProvider.when("/tasklist/", tasklist);
    $routeProvider.when("/tasklist/{tasklistId}", tasklist);

    $routeProvider.when("/login", {
      controller: "LoginController",
      templateUrl: "partials/login.html"
    });
  }]);

  app.run(["$rootScope", function($rootScope) {
    $rootScope.toast = function(toast) {
      $rootScope.$broadcast('toast', toast);
    };

    $rootScope.untoast = function() {
      $rootScope.$broadcast('untoast');
    };
  }]);

})();