var foo = (function() {
  // lowercase because don't use "new"
  // private variables
  // private functions

  return {
    // public members
  };
})(); // self-invoking!

/**
 * More complex example:
 *
 */

var calculator = (function(eq) {
  // private members
  var eqCtl = document.getElementById(eq),
    doAdd = function(x, y) {
      var val = x + y;
      eqCtl.innerHTML = val;
    };
  return { add: doAdd /* or even 'doAdd: doAdd' */ }; // expose public member
})("eqCtl"); // self-invoking

// Easier to call!
calculator.add(11, 12);
