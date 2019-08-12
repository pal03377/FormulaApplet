'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stackLevelRef = null;

var debug = exports.debug = function debug() {
  for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = arguments[_key];
  }

  if ((typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object') {
    if (process.env.TEX_DEBUG) {
      var _console;

      var stackLevel = new Error().stack.split('\n').length;
      if (stackLevelRef == null) {
        stackLevelRef = stackLevel;
      }
      stackLevel -= stackLevelRef;

      var stackSpacing = '';

      for (var i = 0; i < stackLevel; i++) {
        stackSpacing += '-';
      }

      (_console = console).log.apply(_console, [stackSpacing].concat(msg));
    }
  }
};