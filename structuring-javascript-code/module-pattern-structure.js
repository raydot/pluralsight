// Module Structure Overview
/**
 * Compare with Prototype Pattern Structure
 *  Notice no use of "this" or "prototype"
 */

var Calculator = function(eq) {
  // private variables
  // private functions

  //private member
  var eqCtl = document.getElementById(eq);

  return {
    // expose public members and function
    add: function(x, y) {
      var val = x + y;
      eqCtl.innerHTML = val;
    }
  };
};
