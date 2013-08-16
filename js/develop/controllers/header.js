"use strict";

(function() {
  angular.module("fxgtask").controller("HeaderController", ["$scope", function($scope) {
    $scope.retracted = false;

    $scope.toggleSidebar = function() {
      $scope.retracted = !$scope.retracted;
    };
  }]);
})();