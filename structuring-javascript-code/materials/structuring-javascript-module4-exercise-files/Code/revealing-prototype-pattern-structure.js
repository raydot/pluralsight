// Combo of the Revealing Module and the Prototype patterns

var Foo = function(eq) {
  // Variables defined here...with "this"
};

Foo.prototype = (function() {
  // functions defined here

  return {
    //public members defined here as
    //with Revealing Module Pattern
  };
})(); // self-invoking, but not a singleton.  Still need "new."

// More filled in example.
var Calculator = function(eq) {
  // Define variables in constructor so they don't get copied on every new() as they would in the prototype section.  Only the object has the variables, all copies have the functions.
  this.eqCtl = document.getElementById(eq);
};

Calculator.prototype = function() {
  var add = function(x, y) {
    var val = x + y;
    this.eqCtl.innerHTML = val;
  };
  // Just like revealing module, make it public!
  return { add: add };
};

var calc = new Calculator("eqCtl");
calc.add(2, 2);
