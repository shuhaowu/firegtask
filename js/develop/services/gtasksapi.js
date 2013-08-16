"use strict";

(function() {
  angular.module("fxgtask").service("GTaskAPI", ["$http", "$q", "OAuthService", function($http, $q, OAuthService) {

    var API_URL = function() {
      return "https://www.googleapis.com/tasks/v1" + arguments.join("");
    };

    this.tasklists = {
      list: function(maxResults, pageToken) {
        var deferred = $q.defer();

        var params = {};

        if (maxResults !== undefined)
          params.maxResults = maxResults;
        if (pageToken !== undefined)
          params.pageToken = pageToken;

        var req = $http({
          method: "GET",
          url: API_URL("/users/@me/lists"),
          params: params
        });

        req.success(function(data) {
          deferred.resolve(data)
        }).error(function() {
          deferred.reject(arguments);
        });

        return deferred;
      },
      get: function(id) {

      },
      insert: function(tasklist) {

      },
      update: function(id, tasklist) {

      },
      delete: function(id) {

      },
      clear: function(id) {

      }
    };

    this.tasks = {
      list: function(tasklistId) {

      },
      get: function(tasklistId, taskId) {

      },
      insert: function(tasklistId, task) {

      },
      delete: function(tasklistId, taskId) {

      },
      move: function(tasklistId, taskId, parent, previous) {

      },
      update: function(tasklistId, taskId, task) {

      }
    };

  }]);
})();