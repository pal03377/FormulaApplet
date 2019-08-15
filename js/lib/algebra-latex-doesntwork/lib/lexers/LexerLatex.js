define(function (require, exports, module) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Lexer2 = require('./Lexer');

var _Lexer3 = _interopRequireDefault(_Lexer2);

var _greekLetters = require('../models/greek-letters');

var _greekLetters2 = _interopRequireDefault(_greekLetters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LatexLexer = function (_Lexer) {
  _inherits(LatexLexer, _Lexer);

  function LatexLexer(latex) {
    _classCallCheck(this, LatexLexer);

    return _possibleConstructorReturn(this, (LatexLexer.__proto__ || Object.getPrototypeOf(LatexLexer)).call(this, latex));
  }

  _createClass(LatexLexer, [{
    key: 'next_token',
    value: function next_token() {
      this.prev_col = this.col;
      this.prev_line = this.line;

      if (this.pos >= this.text.length) {
        return { type: 'EOF' };
      }

      if (this.current_char() == '\n') {
        this.col = 0;
        this.line++;
      }

      var blank_chars = [' ', '\n', '\\ ', '\\!', '&', '\\,', '\\:', '\\;', '\\quad', '\\qquad'];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = blank_chars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var blank = _step.value;

          if (this.text.startsWith(blank, this.pos)) {
            this.increment(blank.length);
            return this.next_token();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.current_char() == '\\') {
        return this.keyword();
      }

      if (this.current_char().match(/[0-9]/)) {
        return this.number();
      }

      if (this.current_char().match(/[a-zA-Z]/)) {
        return this.variable();
      }

      if (this.current_char() == '{') {
        this.increment();
        return { type: 'bracket', open: true, value: '{' };
      }

      if (this.current_char() == '}') {
        this.increment();
        return { type: 'bracket', open: false, value: '}' };
      }

      if (this.current_char() == '(') {
        this.increment();
        return { type: 'bracket', open: true, value: '(' };
      }

      if (this.current_char() == ')') {
        this.increment();
        return { type: 'bracket', open: false, value: ')' };
      }

      if (this.current_char() == '+') {
        this.increment();
        return { type: 'operator', value: 'plus' };
      }

      if (this.current_char() == '-') {
        this.increment();
        return { type: 'operator', value: 'minus' };
      }

      if (this.current_char() == '*') {
        this.increment();
        return { type: 'operator', value: 'multiply' };
      }

      if (this.current_char() == '/') {
        this.increment();
        return { type: 'operator', value: 'divide' };
      }

      if (this.current_char() == '^') {
        this.increment();
        return { type: 'operator', value: 'exponent' };
      }

      if (this.current_char() == '=') {
        this.increment();
        return { type: 'equal' };
      }

      if (this.current_char() == '_') {
        this.increment();
        return { type: 'underscore' };
      }

      this.error('Unknown symbol: ' + this.current_char());
    }
  }, {
    key: 'keyword',
    value: function keyword() {
      this.eat('\\');

      var variable = this.variable();

      if (variable.value == 'cdot') {
        return { type: 'operator', value: 'multiply' };
      }

      if (variable.value == 'mod') {
        return { type: 'operator', value: 'modulus' };
      }

      if (variable.value == 'left') {
        var bracket = this.next_token();

        if (bracket.type != 'bracket' && bracket.open != true) {
          this.error('Expected opening bracket found ' + JSON.stringify(bracket));
        }

        return bracket;
      }

      if (variable.value == 'right') {
        var _bracket = this.next_token();

        if (_bracket.type != 'bracket' && _bracket.open != false) {
          this.error('Expected closing bracket found ' + JSON.stringify(_bracket));
        }

        return _bracket;
      }

      if (_greekLetters2.default.map(function (x) {
        return x.name;
      }).includes(variable.value.toLowerCase())) {
        return { type: 'variable', value: variable.value };
      }

      return {
        type: 'keyword',
        value: variable.value
      };
    }
  }, {
    key: 'variable',
    value: function variable() {
      var token = '';
      while (this.current_char().match(/[a-zA-Z]/) && this.pos <= this.text.length) {
        token += this.current_char();
        this.increment();
      }

      return {
        type: 'variable',
        value: token
      };
    }
  }]);

  return LatexLexer;
}(_Lexer3.default);

exports.default = LatexLexer;
});
