"use strict";

/** JSDoc documentation
 * [JSDoc]{@link https://jsdoc.app/index.html} Documentation
 * npm run doc
 */

import $ from "jquery";
import Hammer from "@egjs/hammerjs";
import MQ from "./lib/mathquillWrapper.js";
import {
  domLoad,
  findDoc,
  isH5P
} from "./dom.js";

import config from "./config.json";
import {
  prepareEditorApplet,
  setUnit,
  eraseUnit,
  sanitizeInputfieldTag
} from "./editor.js";

import decode from "./decode.js";
import {
  FaTree,
  findCorrespondingRightBracket,
  checkScientificNotation
}
from "./texParser.js";

import {
  initTranslation,
  formulaAppletLanguage
} from "./translate.js";

import initVirtualKeyboard, {
  showVirtualKeyboard
} from "./virtualKeyboard.js";

import {
  checkIfEqual,
  checkIfEquality
} from "./checkIfEqual.js";

console.log('preparePage.js: window.name = ' + window.name);
//TODO hide global vars
var activeMathfieldId = 0;
var FAList = {};
var editHandlerActive = true;

// define class FApp using function syntax
function FApp() {
  // this.index = '';
  this.id = '';
  this.formulaApplet = '';
  this.solution = '';
  this.mqEditableField = '';
  this.mathField = "";
  this.hammer = '';
  this.definitionsetList = [];
  this.precision = config.defaultPrecision;
  this.hasResultField = true;
  this.hasSolution = undefined;
  this.unitAuto = false;
}

// window.addEventListener('message', handleMessage, false); //bubbling phase

// function handleMessage(event) {
//   if (event.data == 'preparePageEvent') {
//     console.info('RECEIVE MESSAGE preparePageEvent (preparePage.js)');
//     preparePage();
//   }
// }

export default async function preparePage() {
  await domLoad;

  // body click deselects all applets
  $(findDoc()).find('body').on('click', function () {
    $(findDoc()).find(".formula_applet").removeClass('selected');
    $(findDoc()).find("button.keyb_button").removeClass('selected');
  });

  // make tab key work
  $(findDoc()).find('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    if (key == 'Tab') {
      var fa = $(findDoc()).find(ev.target).parents('.formula_applet');
      // var id = $(fa).attr('id');
      fa.trigger('click');
    }
  });
  initTranslation();
  initVirtualKeyboard();
  if (window.name == '>>> Editor Window <<<') {
    // do nothing
  } else {
    mathQuillifyAll();
  }
}

function nthroot() {
  var mf = FAList[activeMathfieldId].mathField;
  mf.cmd('\\nthroot');
  mf.typedText(' ');
  mf.keystroke('Tab');
  mf.typedText(' ');
  mf.keystroke('Left');
  mf.keystroke('Left');
  mf.keystroke('Shift-Left');
}

function makeAutoUnitstring(mf) {
  // mf = MathField
  var str = mf.latex();
  var mfLatexForParser = str;
  var unitTag = '\\textcolor{blue}{';
  var pos = str.indexOf(unitTag);
  if (pos >= 0) {
    var left = str.substr(0, pos);
    // rest has to start with {
    var rest = str.substr(pos + unitTag.length - 1);
    var bracket = findCorrespondingRightBracket(rest, '{');
    var middle = rest.substring(1, bracket.rightPos);
    var right = rest.substr(bracket.rightPos + 1);
    var sci = checkScientificNotation(left).isScientific;
    if (sci && middle.length > 0) {
      // expand the unit tag at the right side
      var newLatex = left + unitTag + middle + right + '}';
      // mfLatexForParser = csn.repl + unitTag + middle + right + '}';
      mfLatexForParser = left + unitTag + middle + right + '}';
      editHandlerActive = false;
      mf.latex(newLatex);
      mf.keystroke('Left');
      editHandlerActive = true;
    }
  } else {
    // maybe create unit tag
    var beginning = '';
    for (var i = str.length; i >= 0; i--) {
      beginning = str.substr(0, i);
      sci = checkScientificNotation(beginning).isScientific;
      if (sci) {
        break;
      }
    }
    if (beginning.length > 0) {
      rest = str.substr(beginning.length);
      if (rest.length > 0) {
        newLatex = beginning + unitTag + rest + '}';
        // mfLatexForParser = csn.repl + unitTag + rest + '}';
        mfLatexForParser = beginning + unitTag + rest + '}';
        editHandlerActive = false;
        mf.latex(newLatex);
        mf.keystroke('Left');
        editHandlerActive = true;
      }
    }
  }
  return mfLatexForParser;
}

function mathQuillEditHandler(id) {
  if (editHandlerActive == true) {
    var fApp = FAList[id];
    var mf = fApp.mathField;
    var mfContainer = MQ.StaticMath(fApp.formulaApplet);
    var solution = fApp.solution;
    var hasSolution = fApp.hasSolution;
    var unitAuto = fApp.unitAuto;
    var dsList = fApp.definitionsetList;
    var mfLatexForParser = '';
    if (hasSolution) {
      mfLatexForParser = mf.latex();
    } else {
      mfLatexForParser = mfContainer.latex();
    }
    if (unitAuto) {
      mfLatexForParser = makeAutoUnitstring(mf);
    }

    var precision = fApp.precision;

    var isEqual;
    if (hasSolution) {
      isEqual = checkIfEqual(mfLatexForParser, solution, dsList, precision);
    } else {
      isEqual = checkIfEquality(mfContainer.latex(), dsList, precision);
    }
    var key = '#' + id + '.formula_applet + span.mod';
    var mod = $(findDoc()).find(key)[0];
    if (isEqual) {
      $(findDoc()).find(mod).css({
        "color": "green",
        "font-size": "30pt"
      });
      mod.innerHTML = "&nbsp;&#x2714;";
    } else {
      $(findDoc()).find(mod).css({
        "color": "red",
        "font-size": "30pt"
      });
      mod.innerHTML = "&nbsp;&#x21AF;";
    }
  }
}

function virtualKeyboardEventHandler(_event, cmd) {
  var fApp = FAList[activeMathfieldId];
  var mf = fApp.mathField;

  if (typeof mf !== 'undefined') {
    var endsWithSpace = false;
    if ((cmd.substr(cmd.length - 1)) == ' ') {
      endsWithSpace = true;
      // remove space from end of cmd
      cmd = cmd.substring(0, cmd.length - 1);
    }
    if (cmd.startsWith('#')) {
      // remove # from start of cmd
      cmd = cmd.substring(1);
      if (cmd == 'Enter') {
        mathQuillEditHandler(activeMathfieldId, 'enter');
      } else if (cmd == 'setUnit') {
        setUnit(mf);
      } else if (cmd == 'eraseUnit') {
        eraseUnit(mf);
      } else if (cmd == 'nthroot') {
        nthroot();
      } else if (cmd == 'square') {
        mf.keystroke('Up');
        mf.typedtext('2');
      } else {
        mf.keystroke(cmd);
      }
    } else {
      // no #
      mf.typedText(cmd);
    }
    if (endsWithSpace) {
      mf.typedText(' ');
      mf.keystroke('Backspace');
    }
  }
}

function sanitizePrecision(prec) {
  if (typeof prec == 'undefined') {
    prec = config.defaultPrecision;
  } else {
    prec = prec.replace(/,/g, '.');
    var endsWithPercent = prec[prec.length - 1] === '%';
    if (endsWithPercent) {
      prec = prec.substring(0, prec.length - 1);
    }
    prec = prec.valueOf();
    if (endsWithPercent) {
      prec = prec * 0.01;
    }
  }
  return prec;
}

export async function mathQuillifyAll() {
  console.log('mathQuillifyAll');

  try {
    console.log(findDoc());
    $(findDoc()).find(".formula_applet:not(.mq-math-mode)").each(function () {
      console.log('to be mathquillified:' + this.id);
      mathQuillify(this.id);
    });
  } catch (error) {
    console.error('ERROR: ' + error);
  }
}

export async function mathQuillify(id) {
  await domLoad;
  // console.log('mathQuillify ' + id);
  var result = 'unknown result';
  var $el; //undefined

  try {
    $el = $(findDoc()).find('#' + id + '.formula_applet:not(.mq-math-mode)');
  } catch (error) {
    $el = $('#' + id + '.formula_applet:not(.mq-math-mode)');
  }
  if ($el == 'undefined') {
    result = id + ' not found';
  }
  var domElem = $el[0];
  var isEditor = $el.hasClass('edit');
  // console.log(id + ' isEditor=' + isEditor);

  if (typeof domElem !== 'undefined') {
    var temp = domElem.innerHTML;
    // console.log('temp=' + temp);
    temp = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
    temp = temp.replace(/\\Ohm/g, '\\Omega');
    temp = temp.replace(/\\mathrm/g, '');
    temp = temp.replace(/\\unit{/g, config.unit_replacement);
    temp = temp.replace(/\\cdot/g, config.multiplicationSign);
    // console.log('after replace:');
    // console.log('temp=' + temp);
    //TODO
    if (isEditor && isH5P()) {
      console.log('H5P & Editor');
      var mf = findDoc().getElementById('math-field');
      temp = mf.textContent;
      temp = temp.replace(/{{result}}/g, '\\class{inputfield}{}');
      mf.textContent = temp;
    } else {
      domElem.innerHTML = temp; // funktioniert nicht bei H5P-Editor!!!
    }

    // create new FApp object and store in FAList 
    var fApp = new FApp();
    fApp.hasResultField = ($el.html().indexOf('\\MathQuillMathField{}') >= 0);
    fApp.id = id // name of formulaApplet
    fApp.formulaApplet = domElem;

    if (isEditor) {
      fApp.hasResultField = true;
    }
    // retrieve definitionsets
    var def = $el.attr('def');
    if (typeof def !== 'undefined') {
      fApp.definitionsetList = unifyDefinitions(def);
    }
    // retrieve math/physics mode
    var unitAttr = $el.attr('unit');
    var unitAuto = (typeof unitAttr !== 'undefined' && unitAttr == 'auto');
    var modeAttr = $el.attr('mode');
    var modePhysics = (typeof modeAttr !== 'undefined' && modeAttr == 'physics');
    fApp.unitAuto = unitAuto || modePhysics;

    // retrieve precision
    var prec = $el.attr('precision');
    // allow abbreviation 'prec' for attribute 'precision'
    if (typeof prec !== 'undefined') {
      prec = $el.attr('prec');
    }
    prec = sanitizePrecision(prec);
    fApp.precision = prec;

    // store FApp object in FAList and take id as key
    FAList[id] = fApp;

    // activate mouse clicks
    $el.on('click', clickHandler);
  } else {
    result = 'ERROR: no domElem';
  }
  var mqEditableField;
  if (isEditor) {
    // *** editor ***
    prepareEditorApplet(fApp);
    result = 'EditorApplet is prepared.'
    mqEditableField = $el.find('.mq-editable-field')[0]; // why?
  } else {
    // *** no editor ***
    try {
      MQ.StaticMath(domElem);
    } catch (err) {
      result = 'Error using MQ.StaticMath: ' + err;
      console.trace();
    }
    try {
      if (fApp.hasResultField) {
        if ($el.attr('data-b64') !== undefined) {
          fApp.hasSolution = true;
          var zip = $el.attr('data-b64');
          fApp.solution = decode(zip);
        } else {
          fApp.hasSolution = false;
        }
        mqEditableField = $el.find('.mq-editable-field')[0];
        fApp.mqEditableField = mqEditableField;
        mf = MQ.MathField(mqEditableField, {});
        mf.config({
          handlers: {
            edit: () => {
              mqEditableField.focus();
              mathQuillEditHandler(fApp.id);
            },
            enter: () => {
              mathQuillEditHandler(fApp.id);
            },
          }
        });
        fApp.mathField = mf;

        // make touch sensitive
        try {
          fApp.hammer = new Hammer(mqEditableField);
          fApp.hammer.on("doubletap", function () {
            showVirtualKeyboard();
          });
        } catch (error) {
          console.error('Hammer error: ' + error);
        }
      }
    } catch (error) {
      result = 'ERROR ' + error;
    }
    try {
      // make virtual keyboard show/hide by mouseclick
      ($('<button class="keyb_button">\u2328</button>')).insertAfter($el);
      $(findDoc()).find('button.keyb_button').on('mousedown', function () {
        showVirtualKeyboard();
        $(findDoc()).find("button.keyb_button").removeClass('selected');
      });
      // insert span for right/wrong tag
      $('<span class="mod">&nbsp;</span>').insertAfter($el);
    } catch (error) {
      result = 'ERROR ' + error;
    }
  } // end of *** no editor ***
  var fa = $(findDoc()).find('#' + id);
  if (fa.hasClass('mq-math-mode')) {
    result = 'mathquillifying ' + id + ': SUCCESS';
  }
  console.log(result);
}

function clickHandler(ev) {
  try {
    var fApp = FAList[ev.currentTarget.id];
    if (typeof fApp !== 'undefined') {
      if (fApp.hasResultField) {
        ev.stopPropagation(); // avoid body click
        // deselect all applets
        $(findDoc()).find(".formula_applet").removeClass('selected');
        $(findDoc()).find(".formula_applet").off('virtualKeyboardEvent');
        $(findDoc()).find(fApp.formulaApplet).addClass('selected');
        $(findDoc()).find(fApp.formulaApplet).on('virtualKeyboardEvent', function (_evnt, cmd) {
          virtualKeyboardEventHandler(_evnt, cmd);
        });
        $(findDoc()).find("button.keyb_button").removeClass('selected');
        if ($(findDoc()).find('#virtualKeyboard').css('display') == 'none') {
          // if virtual keyboard is hidden, select keyboard button
          $(findDoc()).find(fApp.formulaApplet).nextAll("button.keyb_button:first").addClass('selected');
        }
        activeMathfieldId = fApp.id;
      } else {
        // fApp has no ResultField (static formula)
        try {
          var mfContainer = MQ.StaticMath(fApp.formulaApplet);
          var mfLatexForParser = mfContainer.latex();
          var myTree = new FaTree();
          myTree.leaf.content = mfLatexForParser;
        } catch (error) {
          console.log('ERROR ' + error);
        }
      }
    }
  } catch (error) {
    console.log('ERROR ' + error);
  }

}

/**
 * decomposes a definition string into a list of definitions
 * 
 * @param {string} def definition sets, composed with & or &&
 * @returns {string[]} array of string expressions with condition to be positive
 * @example def="x > 0 && y < 5" returns ["x", "5-y"], meaning x > 0 and 5-y > 0
 */
function unifyDefinitions(def) {
  def = def.replace(/\s/g, "");
  def = def.replace(/&&/g, "&");
  var dsList = def.split("&");
  for (var i = 0; i < dsList.length; i++) {
    var ds = dsList[i];
    var result = '';
    var temp;
    if (ds.indexOf('>') > -1) {
      temp = ds.split('>');
      if (temp[1] == '0') {
        result = temp[0];
      } else {
        result = temp[0] + '-' + temp[1];
      }
    }
    if (ds.indexOf('<') > -1) {
      temp = ds.split('<');
      if (temp[0] == '0') {
        result = temp[1];
      } else {
        result = temp[1] + '-' + temp[0];
      }
    }
    dsList[i] = result;
  }
  return dsList;
}

$(findDoc()).on("refreshLatexEvent",
  function () {
    var lang = formulaAppletLanguage.get();
    refreshLatex(lang);
  });

function refreshLatex(lang) {
  var id;
  for (id in FAList) {
    var fApp = FAList[id];
    if (!$(fApp.formulaApplet).hasClass('edit')) {
      var hasSolution = fApp.hasSolution || false;
      var oldLatex, newLatex;
      if (hasSolution) {
        var mf = fApp.mathField;
        oldLatex = mf.latex();
      } else {
        try {
          var mfContainer = MQ.StaticMath(fApp.formulaApplet);
          oldLatex = mfContainer.latex();
        } catch (error) {
          console.log('ERROR ' + error);
        }
      }
      if (lang == 'de') {
        newLatex = oldLatex.replace(/\\times/g, '\\cdot');
        newLatex = newLatex.replace(/[.]/g, ',');
      }
      if (lang == 'en') {
        newLatex = oldLatex.replace(/\\cdot/g, '\\times');
        newLatex = newLatex.replace(/,/g, '.');
      }
      newLatex = sanitizeInputfieldTag(newLatex);
      if (oldLatex !== newLatex) {
        console.log('oldLatex=' + oldLatex);
        console.log('newLatex=' + newLatex);
        editHandlerActive = false;
        if (fApp.hasSolution) {
          mf.latex(newLatex);
        } else {
          mfContainer.latex(newLatex);
        }
        editHandlerActive = true;
      }
    }
  }
}