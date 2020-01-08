// Prototype Pattern Structure

var Calculator = funtion(eq) { // constructor
    this.eqCtl = document.getElementById(eq)
}

Calculator.prototype = { // object literal
    add: function (x, y) {
        var val = x + y;
        this.eqCtl.innerHTML = val; // "this" = this object
    }
}

var calc = new Calculator('eqCtl')
calc.add(2, 2)