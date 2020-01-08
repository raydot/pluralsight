//Constructor defines properties and inits object
var Calculator = function (cn, eq) {
    this.currNumberCtl = cn;
    this.eqCtl = eq;
    this.operator = null;
    this.operatorSet = false;
    this.equalsPressed = false;
    this.lastNumber = null;
};

Calculator.prototype = function () {
    var add = function (x, y) {
            return x + y;
        },

        subtract = function (x, y) {
            return x - y;
        },

        multiply = function (x, y) {
            return x * y;
        },

        divide = function (x, y) {
            if (y == 0) {
                alert("Can't divide by 0");
            }
            return x / y;
        },

        setVal = function (val, thisObj) {
            thisObj.currNumberCtl.innerHTML = val;
        },

        setEquation = function (val, thisObj) {
            thisObj.eqCtl.innerHTML = val;
        },

        clearNumbers = function () {
            this.lastNumber = null;
            this.equalsPressed = this.operatorSet = false;
            setVal('0', this);
            setEquation('', this);
        },

        setOperator = function (newOperator) {
            if (newOperator == '=') {
                this.equalsPressed = true;
                calculate(this);
                setEquation('', this);
                return;
            }

            //Handle case where = was pressed
            //followed by an operator (+, -, *, /)
            if (!this.equalsPressed) calculate(this);
            this.equalsPressed = false;
            this.operator = newOperator;
            this.operatorSet = true;
            this.lastNumber = parseFloat(this.currNumberCtl.innerHTML);
            var eqText = (this.eqCtl.innerHTML == '') ?
                    this.lastNumber + ' ' + this.operator + ' ' :
                    this.eqCtl.innerHTML + ' ' + this.operator + ' ';
            setEquation(eqText, this);
        },

        numberClick = function (e) {
            var button = (e.target) ? e.target : e.srcElement;
            if (this.operatorSet == true || this.currNumberCtl.innerHTML == '0') {
                setVal('', this);
                this.operatorSet = false;
            }
            setVal(this.currNumberCtl.innerHTML + button.innerHTML, this);
            setEquation(this.eqCtl.innerHTML + button.innerHTML, this);
        },

        calculate = function (thisObj) {
            if (!thisObj.operator || thisObj.lastNumber == null) return;
            var displayedNumber = parseFloat(thisObj.currNumberCtl.innerHTML),
                newVal = 0;
            //eval() would've made this a whole lot simpler
            //but didn't want to use it in favor of a more
            //"robust" set of methods to demo patterns
            switch (thisObj.operator) {
                case '+':
                    newVal = add(thisObj.lastNumber, displayedNumber);
                    break;
                case '-':
                    newVal = subtract(thisObj.lastNumber, displayedNumber);
                    break;
                case '*':
                    newVal = multiply(thisObj.lastNumber, displayedNumber);
                    break;
                case '/':
                    newVal = divide(thisObj.lastNumber, displayedNumber);
                    break;
            }
            setVal(newVal, thisObj);
            thisObj.lastNumber = newVal;
        };

    //public member definitions
    return {
        numberClick: numberClick,
        setOperator: setOperator,
        clearNumbers: clearNumbers
    };
} ();