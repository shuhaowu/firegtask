"use strict";

(function() {
  angular.module("fxgtask").controller("ToastController", ["$scope", "$timeout", function($scope, $timeout) {
    $scope.displayed = false;
    $scope.html = "";
    $scope.showclose = false;

    $scope.$on('toast', function(event, toast) {
      $scope.showclose = toast.showclose || true;
      $scope.html = toast.message;
      $scope.displayed = true;
      if (toast.autoclose) {
        $scope.showclose = false;
        $timeout($scope.untoast, toast.autoclose);
      }
    });

    $scope.$on('untoast', function(event) {
      $scope.untoast();
    });

    $scope.untoast = function() {
      $scope.html = "";
      $scope.showclose = true;
      $scope.displayed = false;
    };
  }]);
})();