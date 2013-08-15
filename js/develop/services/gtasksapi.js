"use strict";

(function() {
  angular.module("fxgtask").service("GTaskAPI", ["$http", "$q", "OAuthService", function($http, $q, OAuthService) {

    this.tasklists = {
      list: function() {

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