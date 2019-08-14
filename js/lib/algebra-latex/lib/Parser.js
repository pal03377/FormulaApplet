define(function (require, exports, module) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Lexer = require('./lexers/Lexer');

var _Lexer2 = _interopRequireDefault(_Lexer);

var _functions = require('./models/functions');

var _functions2 = _interopRequireDefault(_functions);

var _greekLetters = require('./models/greek-letters');

var _greekLetters2 = _interopRequireDefault(_greekLetters);

var _logger = require('./logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParserLatex = function () {
  function ParserLatex(latex, Lexer) {
    _classCallCheck(this, ParserLatex);

    // if (!(Lexer instanceof LexerClass)) {
    //   throw Error('Please parse a valid lexer as second argument')
    // }

    this.lexer = new Lexer(latex);
    this.ast = null;
    this.current_token = null;
    this.peek_token = null;
  }

  _createClass(ParserLatex, [{
    key: 'parse',
    value: function parse() {
      (0, _logger.debug)('\nLatex parser .parse()');
      this.ast = this.equation();

      this.eat('EOF');

      return this.ast;
    }
  }, {
    key: 'next_token',
    value: function next_token() {
      if (this.peek_token != null) {
        this.current_token = this.peek_token;
        this.peek_token = null;
        (0, _logger.debug)('next token from peek', this.current_token);
      } else {
        this.current_token = this.lexer.next_token();
        (0, _logger.debug)('next token', this.current_token);
      }
      return this.current_token;
    }
  }, {
    key: 'peek',
    value: function peek() {
      if (this.peek_token == null) {
        this.peek_token = this.lexer.next_token();
      }

      (0, _logger.debug)('next token from peek', this.peek_token);
      return this.peek_token;
    }
  }, {
    key: 'error',
    value: function error(message) {
      var line = this.lexer.text.split('\n')[this.lexer.line];
      var spacing = '';

      for (var i = 0; i < this.lexer.col; i++) {
        spacing += ' ';
      }

      throw Error('Parser error\n' + line + '\n' + spacing + '^\nError at line: ' + (this.lexer.line + 1) + ' col: ' + (this.lexer.col + 1) + '\n' + message);
    }
  }, {
    key: 'eat',
    value: function eat(token_type) {
      if (this.next_token().type != token_type) {
        this.error('Expected ' + token_type + ' found ' + JSON.stringify(this.current_token));
      }
    }
  }, {
    key: 'equation',
    value: function equation() {
      // equation : expr ( EQUAL expr )?
      var lhs = this.expr();

      if (this.peek().type != 'equal') {
        return lhs;
      } else {
        this.next_token();
      }

      var rhs = this.expr();

      return {
        type: 'equation',
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'expr',
    value: function expr() {
      // expr : operator

      (0, _logger.debug)('expr');

      this.peek();

      if (this.peek_token.type == 'number' || this.peek_token.type == 'operator' || this.peek_token.type == 'variable' || this.peek_token.type == 'function' || this.peek_token.type == 'keyword' || this.peek_token.type == 'bracket') {
        return this.operator();
      }

      if (this.peek_token.type == 'bracket' && this.peek_token.open == false) {
        return null;
      }

      if (this.peek_token.type == 'EOF') {
        this.next_token();
        return null;
      }

      this.next_token();
      this.error('Unexpected token: ' + JSON.stringify(this.current_token));
    }
  }, {
    key: 'keyword',
    value: function keyword() {
      // keyword : KEYWORD
      //         | fraction
      //         | function

      (0, _logger.debug)('keyword');

      if (this.peek().type != 'keyword') {
        throw Error('Expected keyword found ' + JSON.stringify(this.peek_token));
      }

      var kwd = this.peek_token.value;
      kwd = kwd.toLowerCase();

      (0, _logger.debug)('keyword -', kwd);

      if (kwd == 'frac') {
        return this.fraction();
      }

      if (_functions2.default.includes(kwd.toLowerCase())) {
        return this.function();
      }

      this.eat('keyword');
      return {
        type: 'keyword',
        value: this.current_token.value
      };
    }
  }, {
    key: 'fraction',
    value: function fraction() {
      // fraction : FRAC group group

      (0, _logger.debug)('fraction');

      this.eat('keyword');

      if (this.current_token.value != 'frac') {
        this.error('Expected fraction found ' + JSON.stringify(this.current_token));
      }

      var nominator = this.group();
      var denominator = this.group();

      return {
        type: 'operator',
        operator: 'divide',
        lhs: nominator,
        rhs: denominator
      };
    }
  }, {
    key: 'function',
    value: function _function() {
      // function : FUNCTION ( group | number )

      (0, _logger.debug)('function');

      this.eat('keyword');
      var value = this.current_token.value;

      var content = void 0;
      if (this.peek().type == 'bracket') {
        content = this.group();
      } else {
        content = this.number();
      }

      return {
        type: 'function',
        value: value,
        content: content
      };
    }
  }, {
    key: 'group',
    value: function group() {
      // group : LBRACKET expr RBRACKET

      (0, _logger.debug)('start group');

      this.eat('bracket');
      if (this.current_token.open != true) {
        this.error('Expected opening bracket found ' + this.current_token);
      }

      var content = this.expr();

      this.eat('bracket');
      if (this.current_token.open != false) {
        this.error('Expected closing bracket found ' + this.current_token);
      }

      (0, _logger.debug)('end group');

      return content;
    }
  }, {
    key: 'operator',
    value: function operator() {
      // operator : operator_term ((PLUS | MINUS) operator)?
      (0, _logger.debug)('operator left');
      var lhs = this.operator_multiply();
      var op = this.peek();

      if (op.type != 'operator' || op.value != 'plus' && op.value != 'minus') {
        (0, _logger.debug)('operator only left side');
        return lhs;
      }

      // Operator token
      this.next_token();

      (0, _logger.debug)('operator right');
      var rhs = this.operator();

      return {
        type: 'operator',
        operator: op.value,
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'operator_multiply',
    value: function operator_multiply() {
      // operator_multiply : (operator_divide | GROUP) ( (MULTIPLY operator_multiply) | number )?

      (0, _logger.debug)('op mul left');

      var lhs = void 0;

      if (this.peek().type == 'bracket') {
        lhs = this.group();
      } else {
        lhs = this.operator_divide();
      }

      var op = this.peek();

      if (op.type == 'number' || op.type == 'variable' || op.type == 'keyword' || op.type == 'bracket' && op.value == '(') {
        op = {
          type: 'operator',
          value: 'multiply'
        };
      } /* else if (op.type == 'bracket' && op.open == true) {
        let rhs = this.group()
         return {
          type: 'operator',
          operator: 'multiply',
          lhs,
          rhs,
        }
        }*/else if (op.type != 'operator' || op.value != 'multiply' && op.value != 'divide') {
          (0, _logger.debug)('term only left side');
          return lhs;
        } else {
          // Operator token
          this.next_token();
        }

      (0, _logger.debug)('op mul right');

      var rhs = this.operator_multiply();

      return {
        type: 'operator',
        operator: op.value,
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'operator_divide',
    value: function operator_divide() {
      // operator_divide : operator_mod ( DIVIDE operator_divide )?

      (0, _logger.debug)('op div left');

      var lhs = this.operator_mod();
      var op = this.peek();

      if (op.type != 'operator' || op.value != 'divide') {
        (0, _logger.debug)('divide only left side');
        return lhs;
      } else {
        // Operator token
        this.next_token();
      }

      (0, _logger.debug)('op div right');

      var rhs = this.operator_divide();

      return {
        type: 'operator',
        operator: 'divide',
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'operator_mod',
    value: function operator_mod() {
      // operator_mod : operator_exp ( MODULUS operator_mod )?

      (0, _logger.debug)('modulus left');

      var lhs = this.operator_exp();
      var op = this.peek();

      if (op.type != 'operator' || op.value != 'modulus') {
        (0, _logger.debug)('modulus only left side');
        return lhs;
      } else {
        // Operator token
        this.next_token();
      }

      (0, _logger.debug)('modulus right');

      var rhs = this.operator_mod();

      return {
        type: 'operator',
        operator: 'modulus',
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'operator_exp',
    value: function operator_exp() {
      // operator_exp : subscript ( EXPONENT operator_exp )?

      var lhs = this.subscript();
      var op = this.peek();

      if (op.type != 'operator' || op.value != 'exponent') {
        (0, _logger.debug)('modulus only left side');
        return lhs;
      } else {
        // Operator token
        this.next_token();
      }

      var rhs = this.operator_exp();

      return {
        type: 'operator',
        operator: 'exponent',
        lhs: lhs,
        rhs: rhs
      };
    }
  }, {
    key: 'variable',
    value: function variable() {
      this.eat('variable');

      return {
        type: 'variable',
        value: this.current_token.value
      };
    }
  }, {
    key: 'subscript',
    value: function subscript() {
      var base_num = this.number();

      if (this.peek().type == 'underscore') {
        this.eat('underscore');

        var sub_value = this.subscript();

        return {
          type: 'subscript',
          base: base_num,
          subscript: sub_value
        };
      }

      return base_num;
    }
  }, {
    key: 'number',
    value: function number() {
      // number : NUMBER
      //        | uni_operator
      //        | variable
      //        | keyword
      //        | symbol
      //        | group

      (0, _logger.debug)('number');

      this.peek();

      if (this.peek_token.type == 'number') {
        this.next_token();
        return {
          type: this.current_token.type,
          value: this.current_token.value
        };
      }

      if (this.peek_token.type == 'operator') {
        return this.uni_operator();
      }

      if (this.peek_token.type == 'variable') {
        return this.variable();
      }

      if (this.peek_token.type == 'keyword') {
        return this.keyword();
      }

      if (this.peek_token.type == 'bracket') {
        return this.group();
      }

      this.next_token();
      this.error('Expected number, variable, function, group, or + - found ' + JSON.stringify(this.current_token));
    }
  }, {
    key: 'uni_operator',
    value: function uni_operator() {
      this.eat('operator');
      if (this.current_token.value == 'plus' || this.current_token.value == 'minus') {
        var prefix = this.current_token.value;
        var value = this.number();

        if (value.type == 'number') {
          return {
            type: 'number',
            value: prefix == 'minus' ? -value.value : value.value
          };
        }

        return {
          type: 'uni-operator',
          operator: prefix,
          value: value
        };
      }
    }
  }]);

  return ParserLatex;
}();

exports.default = ParserLatex;
});
