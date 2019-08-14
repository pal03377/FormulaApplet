'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _greekLetters = require('../models/greek-letters');

var greekLetters = _interopRequireWildcard(_greekLetters);

var _logger = require('../logger');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathFormatter = function () {
  function MathFormatter(ast) {
    _classCallCheck(this, MathFormatter);

    this.ast = ast;
  }

  _createClass(MathFormatter, [{
    key: 'format',
    value: function format() {
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.ast;

      if (root == null) {
        return '';
      }

      switch (root.type) {
        case 'operator':
          return this.operator(root);
        case 'number':
          return this.number(root);
        case 'function':
          return this.function(root);
        case 'variable':
          return this.variable(root);
        case 'equation':
          return this.equation(root);
        case 'subscript':
          return this.subscript(root);
        case 'uni-operator':
          return this.uni_operator(root);
        default:
          throw Error('Unexpected type: ' + root.type);
      }
    }
  }, {
    key: 'operator',
    value: function operator(root) {
      var op = root.operator;

      switch (op) {
        case 'plus':
          op = '+';
          break;
        case 'minus':
          op = '-';
          break;
        case 'multiply':
          op = '*';
          break;
        case 'divide':
          op = '/';
          break;
        case 'modulus':
          op = '%';
          break;
        case 'exponent':
          op = '^';
          break;
        default:
      }

      var lhs = this.format(root.lhs);
      var rhs = this.format(root.rhs);

      var precedensOrder = [['modulus'], ['exponent'], ['multiply', 'divide'], ['plus', 'minus']];

      var higherPrecedens = function higherPrecedens(a, b) {
        var depth = function depth(op) {
          return precedensOrder.findIndex(function (val) {
            return val.includes(op);
          });
        };

        return depth(b) > depth(a);
      };

      var shouldHaveParenthesis = function shouldHaveParenthesis(child) {
        return child.type == 'operator' && higherPrecedens(root.operator, child.operator);
      };

      var lhsParen = shouldHaveParenthesis(root.lhs);
      var rhsParen = shouldHaveParenthesis(root.rhs);

      // Special case for division
      rhsParen = rhsParen || op == '/' && root.rhs.type == 'operator';

      if (root.operator == 'exponent') {
        if (root.rhs.type == 'number' && root.rhs.value < 0) {
          rhsParen = true;
        }
      }

      lhs = lhsParen ? '(' + lhs + ')' : lhs;
      rhs = rhsParen ? '(' + rhs + ')' : rhs;

      return lhs + op + rhs;
    }
  }, {
    key: 'number',
    value: function number(root) {
      return '' + root.value;
    }
  }, {
    key: 'function',
    value: function _function(root) {
      return root.value + '(' + this.format(root.content) + ')';
    }
  }, {
    key: 'variable',
    value: function variable(root) {
      var greekLetter = greekLetters.getSymbol(root.value);

      if (greekLetter) {
        return greekLetter;
      }

      return '' + root.value;
    }
  }, {
    key: 'equation',
    value: function equation(root) {
      return this.format(root.lhs) + '=' + this.format(root.rhs);
    }
  }, {
    key: 'subscript',
    value: function subscript(root) {
      if (root.subscript.type == 'variable' && root.subscript.value.length == 1) {
        return this.format(root.base) + '_' + this.format(root.subscript);
      }

      return this.format(root.base) + '_(' + this.format(root.subscript) + ')';
    }
  }, {
    key: 'uni_operator',
    value: function uni_operator(root) {
      if (root.operator == 'minus') {
        return '-' + this.format(root.value);
      }

      return this.format(root.value);
    }
  }]);

  return MathFormatter;
}();

exports.default = MathFormatter;