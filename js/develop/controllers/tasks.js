"use strict";

(function() {
  var module = angular.module("fxgtask");

  module.controller("TasksController", ["$scope", function($scope) {

  }]);

  module.controller("TasklistsController", ["$scope", "OAuthService", "Models", function($scope, OAuthService, Models) {
    $scope.tasklists = [{id: "", title: "Tasks"}];

    if (OAuthService.getOauthInfo()) {
      $scope.tasklists = Models.Tasklist.list();
    }
  }]);

})();