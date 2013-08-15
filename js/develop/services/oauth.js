"use strict";

(function() {
  angular.module("fxgtask").service("OAuthService", ["$http", "$q", function($http, $q) {

    this.authorize = function(code) {
      var deferred = $q.defer();

      var req = $http({
        method: "POST",
        url: "https://accounts.google.com/o/oauth2/token",
        data: paramify({code: code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT_URI, grant_type: "authorization_code"}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      });

      req.success(function(data) {
        localStorage.oauthInfo = JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires: new Date(new Date().getTime() + data.expires_in * 1000)
        });

        deferred.resolve();
      });

      req.error(function() {
        deferred.reject(arguments);
      });

      return deferred.promise;
    };

    this.getOauthInfo = function() {
      return localStorage.oauthInfo ? JSON.parse(localStorage.oauthInfo) : null;
    };

    this.refreshAuth = function() {
      var deferred = $q.defer();

      var oauthInfo = this.getOauthInfo();
      if (oauthInfo && oauthInfo.refresh_token) {

        var data = {
          client_secret: CLIENT_SECRET,
          client_id: CLIENT_ID,
          refresh_token: oauthInfo.refresh_token,
          grant_type: "refresh_token"
        };

        var req = $http({
          method: "POST",
          url: "https://accounts.google.com/o/oauth2/token",
          data: paramify(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });

        req.success(function(data) {
          oauthInfo.access_token = data.access_token;
          oauthInfo.expires = new Date(new Date().getTime() + data.expires_in * 1000);
          localStorage.oauthInfo = JSON.stringify(oauthInfo);

          deferred.resolve();
        });

        req.error(function() {
          deferred.reject(arguments);
        });
      } else {
        deferred.reject("No refresh token");
      }

      return deferred.promise;
    };

    // TODO: refresh only when needed?
    this.refreshAuth();

  }]);
})();