﻿$(document).ready(function() {
  loadSettings();
  $("#SubmitButton").click(function() {
    if (hasLocalStorage) storeSettings();
    else alert("No local storage support");
  });
  $("#ClearButton").click(function() {
    localStorage.clear();
    loadSettings();
  });
});

var LocalStorage = function() {};

LocalStorage.prototype = (function() {
  // private members
  var loadSettings = function() {
    var name = localStorage.getItem("name");
    var state = localStorage.getItem("state");
    $("#NameTextBox").val(name);
    $("#StatesSelect").val(state);
  };

  var storeSettings = function() {
    try {
      localStorage.setItem("name", $("#NameTextBox").val());
      localStorage.setItem("state", $("#StatesSelect").val());
      $("#OutputSpan").html("Settings Saved!");
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {
        alert("Storage quota exceeded");
      }
    }
  };

  var hasLocalStorage = function() {
    return "localStorage" in window && window["localStorage"] != null;
  };
  // public members
  return {
    loadSettings: loadSettings,
    storeSettings: storeSettings,
    hasLocalStorage: hasLocalStorage
  };
})();
