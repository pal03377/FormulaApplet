'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.letters = undefined;
exports.toUpperCase = toUpperCase;
exports.isUpperCase = isUpperCase;
exports.getSymbol = getSymbol;
exports.getName = getName;
exports.convertSymbols = convertSymbols;

var _logger = require('../logger');

var letters = exports.letters = [{
  name: 'alpha',
  symbol: 'α'
}, {
  name: 'beta',
  symbol: 'β'
}, {
  name: 'gamma',
  symbol: 'γ'
}, {
  name: 'delta',
  symbol: 'δ'
}, {
  name: 'epsilon',
  symbol: 'ϵ'
}, {
  name: 'zeta',
  symbol: 'ζ'
}, {
  name: 'eta',
  symbol: 'η'
}, {
  name: 'theta',
  symbol: 'θ'
}, {
  name: 'iota',
  symbol: 'ι'
}, {
  name: 'kappa',
  symbol: 'κ'
}, {
  name: 'lambda',
  symbol: 'λ'
}, {
  name: 'mu',
  symbol: 'μ'
}, {
  name: 'nu',
  symbol: 'ν'
}, {
  name: 'omicron',
  symbol: 'ο'
}, {
  name: 'pi',
  symbol: 'π'
}, {
  name: 'rho',
  symbol: 'ρ'
}, {
  name: 'sigma',
  symbol: 'σ'
}, {
  name: 'tau',
  symbol: 'τ'
}, {
  name: 'upsilon',
  symbol: 'υ'
}, {
  name: 'phi',
  symbol: 'ϕ'
}, {
  name: 'chi',
  symbol: 'χ'
}, {
  name: 'psi',
  symbol: 'ψ'
}, {
  name: 'omega',
  symbol: 'ω'
}];

function toUpperCase(x) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

function isUpperCase(x) {
  return x.charAt(0).toUpperCase() === x.charAt(0);
}

function getSymbol(name) {
  var symbol = letters.find(function (x) {
    return x.name === name.toLowerCase();
  });
  if (typeof symbol === 'undefined') return null;
  symbol = symbol.symbol;
  if (isUpperCase(name)) symbol = toUpperCase(symbol);
  return symbol;
}

function getName(symbol) {
  var name = letters.find(function (x) {
    return x.symbol === symbol.toLowerCase();
  });
  if (typeof name === 'undefined') return null;
  name = name.name;
  if (isUpperCase(symbol)) name = toUpperCase(name);
  return name;
}

function convertSymbols(math) {
  (0, _logger.debug)('Converting math symbols ' + math);
  letters.forEach(function (letter) {
    math = math.split(letter.symbol).join(letter.name);
    math = math.split(toUpperCase(letter.symbol)).join(toUpperCase(letter.name));
  });
  (0, _logger.debug)('Converted math symbols ' + math);
  return math;
}

exports.default = letters;