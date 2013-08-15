"use strict";

(function() {

  angular.module("fxgtask").factory("Models", ["GTaskAPI", function(api) {

    // Models provides caching locally.

    function Task() {

    };

    Task.prototype.serialize = function() {

    };

    function Tasklist() {

    };

    Tasklist.prototype.serialize = function() {

    };

    return {
      Task: Task,
      Tasklist: Tasklist
    };

  }]);
})();