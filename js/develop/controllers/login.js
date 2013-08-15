"use strict";

(function() {

  angular.module("fxgtask").controller("LoginController", ["$scope", "OAuthService", function($scope, OAuthService) {

    $scope.authorized = OAuthService.getOauthInfo() !== null;

    $scope.popup = null;
    $scope.attempting = false;
    $scope.attemptOAuth = function() {
      $scope.attempting = true;
      var params;
      if (!$scope.authorized) {
        params = "?response_type=code&redirect_uri=" + REDIRECT_URI + "&scope=" + SCOPES + "&client_id=" + encodeURIComponent(CLIENT_ID);
        $scope.popup = window.open(GOOGLE_AUTH_BASE + params, "Authenticate into Google", "height=250,width=400");
      }
    };

    $scope.authcode = "";
    $scope.authorize = function() {
      OAuthService.authorize($scope.authcode).then(function() {
        $scope.toast({message: "You have been logged in!", autoclose: 1500});
        $scope.authorized = true;
        $scope.attempting = false;
        if ($scope.popup)
          $scope.popup.close();
      }, function(e) {
        $scope.toast({message: "An error occured!", autoclose: 1500});
        $scope.attempting = false;
        console.log(e);
      });
    };
  }]);
})();