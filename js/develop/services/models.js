"use strict";

(function() {

  angular.module("fxgtask").factory("Models", ["$rootScope", "$q", "GTaskAPI", function($rootScope, $q, api) {

    // Models provides caching locally.

    function Task() {

    };

    Task.prototype.serialize = function() {

    };

    function Tasklist(resource) {
      this.id = resource.id;
      this.etag = resource.etag;
      this.title = resource.title;
      this.selfLink = resource.selfLink;
      this.updated = Date.parse(resource.updated);
    };

    Tasklist.list = function(force) {
      var deferred = $q.defer();

      if (force || !localStorage.tasklists) {
        var d = api.tasklists.list();
        d.then(function(list) {
          localStorage.tasklists = JSON.stringify(list.items);
          var items = [];
          for (var i=0; i<list.items.length; i++)
            items.push(new Tasklist(list.items[i]));

          deferred.resolve(items);
        }, function() {

          $rootScope.toast({message: "An error happened while updating task lists.", autoclose: 1500});
          console.log(arguments);
          deferred.reject(arguments);
        });
      } else {
        var items = [];
        var raw = JSON.parse(localStorage.tasklists);
        for (var i=0; i<raw.length; i++)
          items.push(new Tasklist(raw[i]));

        deferred.resolve(items);
      }

      return deferred;
    };

    Tasklist.prototype.serialize = function() {
      return {
        kind: "tasks#taskList",
        id: this.id,
        etag: this.etag,
        title: this.title,
        selfLink: this.selfLink,
        updated: this.updated.toISOString()
      };
    };

    return {
      Task: Task,
      Tasklist: Tasklist
    };

  }]);
})();