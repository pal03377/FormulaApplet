'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An abstract class shared between lexers
 */
var Lexer = function () {
  function Lexer(text) {
    _classCallCheck(this, Lexer);

    this.text = text;
    this.pos = 0;

    this.col = 0;
    this.line = 0;
    this.prev_col = 0;
    this.prev_line = 0;
  }

  _createClass(Lexer, [{
    key: 'increment',
    value: function increment() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.pos += amount;
      this.col += amount;
    }
  }, {
    key: 'error',
    value: function error(message) {
      var line = this.text.split('\n')[this.prev_line];
      var spacing = '';

      for (var i = 0; i < this.prev_col; i++) {
        spacing += ' ';
      }

      throw Error('Lexer error\n' + line + '\n' + spacing + '^\nError at line: ' + (this.prev_line + 1) + ' col: ' + (this.prev_col + 1) + '\n' + message);
    }
  }, {
    key: 'current_char',
    value: function current_char() {
      return this.text.charAt(this.pos);
    }
  }, {
    key: 'eat',
    value: function eat(char) {
      if (this.current_char() == char) {
        this.pos += 1;
      } else {
        this.error('Expected ' + char + ' found ' + this.current_char());
      }
    }
  }, {
    key: 'number',
    value: function number() {
      var num = '';
      var separator = false;

      while (this.current_char().match(/[0-9\.]/)) {
        if (this.current_char() == '.') {
          if (separator) {
            break;
          } else {
            separator = true;
          }
        }

        num += this.current_char();
        this.increment();
      }

      var result = Number(num);
      if (isNaN(result)) {
        this.error('Could not parse number: \'' + num + '\'');
      }

      return {
        type: 'number',
        value: result
      };
    }
  }]);

  return Lexer;
}();

exports.default = Lexer;