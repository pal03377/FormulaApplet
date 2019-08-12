'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _FormatterMath = require('./formatters/FormatterMath');

var _FormatterMath2 = _interopRequireDefault(_FormatterMath);

var _FormatterLatex = require('./formatters/FormatterLatex');

var _FormatterLatex2 = _interopRequireDefault(_FormatterLatex);

var _logger = require('./logger');

var _greekLetters = require('./models/greek-letters');

var greekLetters = _interopRequireWildcard(_greekLetters);

var _LexerLatex = require('./lexers/LexerLatex');

var _LexerLatex2 = _interopRequireDefault(_LexerLatex);

var _LexerMath = require('./lexers/LexerMath');

var _LexerMath2 = _interopRequireDefault(_LexerMath);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A class for parsing latex math
 */
var AlgebraLatex = function () {
  /**
   * Create an AlgebraLatex object, to be converted
   * @deprecated @param  {String} latex Optional, if defined it will automatically parse the input as latex
   * @return {AlgebraLatex} object to be converted
   */
  function AlgebraLatex(latex) {
    _classCallCheck(this, AlgebraLatex);

    if (typeof latex == 'undefined') {
      return;
    }

    this.parseLatex(latex);
  }

  _createClass(AlgebraLatex, [{
    key: 'parseLatex',
    value: function parseLatex(latex) {
      // Replace , with . for european decimal separators
      latex = latex.replace(/,/g, '.');

      this.input = latex;
      this.parser = new _Parser2.default(latex, _LexerLatex2.default);
      this.parser.parse();

      return this;
    }
  }, {
    key: 'parseMath',
    value: function parseMath(math) {
      // Replace , with . for european decimal separators
      math = math.replace(/,/g, '.');

      this.input = math;
      this.parser = new _Parser2.default(math, _LexerMath2.default);
      this.parser.parse();

      return this;
    }
  }, {
    key: 'getAst',
    value: function getAst() {
      return this.parser.ast;
    }

    /**
     * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
     * @return string The serialized string
     */

  }, {
    key: 'toMath',
    value: function toMath() {
      return new _FormatterMath2.default(this.getAst()).format();
    }

    /**
     * Will return a formatted latex string eg. \frac{1}{\sqrt{2}}
     * @return string The formatted latex string
     */

  }, {
    key: 'toLatex',
    value: function toLatex() {
      return new _FormatterLatex2.default(this.getAst()).format();
    }

    /**
     * @deprecated toLatex() should be used instead
     */

  }, {
    key: 'toTex',
    value: function toTex() {
      return self.toLatex();
    }

    /**
     * Will return an algebra.js Expression or Equation
     * @param {Object} algebraJS an instance of algebra.js
     * @return {(Expression|Equation)} an Expression or Equation
     */

  }, {
    key: 'toAlgebra',
    value: function toAlgebra(algebraJS) {
      if (algebraJS === null) {
        throw new Error('Algebra.js must be passed as a parameter for toAlgebra');
      }

      var mathToParse = this.toMath();
      mathToParse = greekLetters.convertSymbols(mathToParse);

      return algebraJS.parse(mathToParse);
    }

    /**
     * Will return an algebrite object
     * @param {Object} algebrite an instance of algebrite
     * @return {Object} an algebrite object
     */

  }, {
    key: 'toAlgebrite',
    value: function toAlgebrite(algebrite) {
      if (algebrite === null) {
        return new Error('Algebrite must be passed as a parameter for toAlgebrite');
      }

      if (this.isEquation()) {
        return new Error('Algebrite can not handle equations, only expressions');
      }

      var mathToParse = this.toMath();
      mathToParse = greekLetters.convertSymbols(mathToParse);

      return algebrite.eval(mathToParse);
    }

    /**
     * Will return a coffequate object
     * @return {Object} a coffeequate object
     */

  }, {
    key: 'toCoffeequate',
    value: function toCoffeequate(coffeequate) {
      if (coffeequate === null) {
        return new Error('Coffeequante must be passed as a parameter for toCoffeequante');
      }

      var result = this.toMath();
      result = result.replace(/\^/g, '**');

      return coffeequate(result);
    }

    /**
     * Wether or not the object is an equation or an expression
     * @return Boolean true if expression
     */

  }, {
    key: 'isEquation',
    value: function isEquation() {
      return this.input.includes('=');
    }
  }]);

  return AlgebraLatex;
}();

module.exports = AlgebraLatex;