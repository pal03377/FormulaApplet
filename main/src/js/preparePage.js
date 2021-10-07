"use strict";

/** JSDoc documentation
 * [JSDoc]{@link https://jsdoc.app/index.html} Documentation
 * npm run doc
 */

import $ from "jquery";
import Hammer from "@egjs/hammerjs";
import MQ from "./lib/mathquillWrapper.js";
import {
  domLoad
} from "./dom.js";

import config from "./config.json";
import {
  prepareEditorPage,
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

var activeMathfieldId = 0;
// var FAList = [];
var FAList2 = {};
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

export default async function preparePage() {
  await domLoad;
  console.log('preparePage');
  // make virtual keyboard show/hide by mouseclick
  // console.log('virtual keyboard buttons');
  ($('<button class="keyb_button">\u2328</button>')).insertAfter($(".formula_applet"));
  $('button.keyb_button').on('mousedown', function () {
    showVirtualKeyboard();
    $("button.keyb_button").removeClass('selected');
  });
  // mathQuillify_old();

  // body click deselects all applets
  $('body').on('click', function () {
    $(".formula_applet").removeClass('selected');
    $("button.keyb_button").removeClass('selected');
  });

  // make tab key work
  $('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    if (key == 'Tab') {
      var fa = $(ev.target).parents('.formula_applet');
      // var id = $(fa).attr('id');
      fa.trigger('click');
    }
  });
  initTranslation();
  mathQuillifyAll();
}

function nthroot() {
  var mf = FAList2[activeMathfieldId].mathField;
  mf.cmd('\\nthroot');
  mf.typedText(' ');
  mf.keystroke('Tab');
  mf.typedText(' ');
  mf.keystroke('Left');
  mf.keystroke('Left');
  mf.keystroke('Shift-Left');
}

// export function getFAppFromId(id) {
//   for (var i = 0; i < FAList.length; i++) {
//     if (FAList[i].id == id) {
//       return FAList[i];
//     }
//   }
// }

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
    var fApp = FAList2[id];
    // console.log(fApp);
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
    var mod = $(key)[0];
    if (isEqual) {
      $(mod).css({
        "color": "green",
        "font-size": "30pt"
      });
      mod.innerHTML = "&nbsp;&#x2714;";
    } else {
      $(mod).css({
        "color": "red",
        "font-size": "30pt"
      });
      mod.innerHTML = "&nbsp;&#x21AF;";
    }
  }
}

function virtualKeyboardEventHandler(_event, cmd) {
  console.log(cmd);
  var fApp = FAList2[activeMathfieldId];
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

async function mathQuillifyAll() {
  initVirtualKeyboard();
  console.log('mathQuillifyAll');
  $(".formula_applet:not(.mq-math-mode)").each(function () {
    // console.log(this.id);
    mathQuillify(this.id);
  });
}

export async function mathQuillify(id) {
  await domLoad;
  // console.log('mathQuillify ' + id);
  var $el = $('#' + id + '.formula_applet:not(.mq-math-mode)');
  var domElem = $el[0];
  if (typeof domElem !== 'undefined') {
    // console.log(domElem);
    var temp = domElem.innerHTML;
    temp = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
    temp = temp.replace(/\\Ohm/g, '\\Omega');
    temp = temp.replace(/\\mathrm/g, '');
    temp = temp.replace(/\\unit{/g, config.unit_replacement);
    temp = temp.replace(/\\cdot/g, config.multiplicationSign);
    domElem.innerHTML = temp;

    // create new FApp object and store in FAList 
    // var index = FAList.length;
    var fApp = new FApp();
    // fApp.index = index;
    fApp.hasResultField = ($el.html().indexOf('\\MathQuillMathField{}') >= 0);
    // fApp.id = $el.attr('id') // name of formulaApplet
    fApp.id = id // name of formulaApplet
    fApp.formulaApplet = domElem;

    var isEditor = $el.hasClass('edit');
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
    // fApp.formulaApplet = domElem;

    // store FApp object in FAList2 and take id as key
    FAList2[id] = fApp;

    // activate mouse clicks
    $el.on('click', clickHandler);
  }
  // console.log(FAList2);
  if (isEditor) {
    // *** editor ***
    prepareEditorPage(fApp);
    var mqEditableField;
    mqEditableField = $el.find('.mq-editable-field')[0];
  } else {
    // *** no editor ***
    try {
      MQ.StaticMath(domElem);
    } catch (err) {
      console.error('Error using MQ.StaticMath: ' + err);
      console.trace();
    }
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
      var mf = MQ.MathField(mqEditableField, {});
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
    // insert span for right/wrong tag
    $('<span class="mod">&nbsp;</span>').insertAfter($el);
  } // end of *** no editor ***
}

function clickHandler(ev) {
  try {
    var fApp = FAList2[ev.currentTarget.id];
    // console.log('click on ' + fApp.formulaApplet);
    // console.log(ev);
    // ev.target.index does not exist, so use FAList2
    // console.log(fApp);
    if (fApp.hasResultField) {
      ev.stopPropagation(); // avoid body click
      // deselect all applets
      $(".formula_applet").removeClass('selected');
      $(".formula_applet").off('virtualKeyboardEvent');
      $(fApp.formulaApplet).addClass('selected');
      $(fApp.formulaApplet).on('virtualKeyboardEvent', function (_evnt, cmd) {
        virtualKeyboardEventHandler(_evnt, cmd);
      });
      $("button.keyb_button").removeClass('selected');
      if ($('#virtualKeyboard').css('display') == 'none') {
        // if virtual keyboard is hidden, select keyboard button
        $(fApp.formulaApplet).nextAll("button.keyb_button:first").addClass('selected');
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
  } catch (error) {
    console.log('ERROR ' + error);
  }

}

// async function mathQuillify_old() {
//   await domLoad;
//   initVirtualKeyboard();
//   $(".formula_applet:not(.mq-math-mode)").each(function () {
//     var temp = this.innerHTML;
//     temp = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
//     this.innerHTML = temp;
//   });

//   $(".formula_applet:not(.mq-math-mode)").each(function () {
//     var temp = (this.innerHTML);
//     temp = temp.replace(/\\Ohm/g, '\\Omega');
//     temp = temp.replace(/\\mathrm/g, '');
//     this.innerHTML = temp.replace(/\\unit{/g, '\\textcolor{blue}{');
//   });

//   $(".formula_applet").each(function () {
//     var temp = this.innerHTML;
//     temp = temp.replace(/\\cdot/g, config.multiplicationSign);
//     this.innerHTML = temp;
//   });

//   $(".formula_applet").each(async (index, domElem) => {
//     let $el = $(domElem);
//     var fApp = new FApp();
//     fApp.hasResultField = ($el.html().indexOf('\\MathQuillMathField{}') >= 0);
//     fApp.index = index;
//     fApp.id = $el.attr('id') // name of formulaApplet
//     var isEditor = $el.hasClass('edit');
//     if (isEditor) {
//       fApp.hasResultField = true;
//     }
//     var def = $el.attr('def');
//     if (typeof def !== 'undefined') {
//       fApp.definitionsetList = unifyDefinitions(def);
//     }
//     var unitAttr = $el.attr('unit');
//     var unitAuto = (typeof unitAttr !== 'undefined' && unitAttr == 'auto');
//     var modeAttr = $el.attr('mode');
//     var modePhysics = (typeof modeAttr !== 'undefined' && modeAttr == 'physics');
//     fApp.unitAuto = unitAuto || modePhysics;

//     var prec = $el.attr('precision');
//     if (typeof prec !== 'undefined') {
//       prec = $el.attr('prec');
//     }
//     prec = sanitizePrecision(prec);
//     fApp.precision = prec;
//     fApp.formulaApplet = domElem;

//     $el.click(ev => {
//       if (fApp.hasResultField) {
//         ev.stopPropagation(); // avoid body click
//         $(".formula_applet").removeClass('selected');
//         $(".formula_applet").off('customKeyboardEvent');
//         $el.addClass('selected');
//         // $el.on('customKeyboardEvent', function (evnt, cmd) {
//         //   keyboardEvent(cmd);
//         // });
//         $("button.keyb_button").removeClass('selected');
//         if ($('#virtualKeyboard').css('display') == 'none') {
//           $el.nextAll("button.keyb_button:first").addClass('selected');
//         }
//         activeMathfieldIndex = fApp.index;
//       } else {
//         try {
//           var mfContainer = MQ.StaticMath(FAList[index].formulaApplet);
//           var mfLatexForParser = mfContainer.latex();
//           var myTree = new FaTree();
//           myTree.leaf.content = mfLatexForParser;
//         } catch (error) {
//           console.log('ERROR ' + error);
//         }
//       }
//     })
//     FAList[index] = fApp;

//     if (isEditor) {
//       prepareEditorPage(fApp);
//       var mqEditableField;
//       mqEditableField = $el.find('.mq-editable-field')[0];
//     } else {
//       //******************
//       // *** no editor ***
//       try {
//         MQ.StaticMath(domElem);
//       } catch (err) {
//         console.error('Error using MQ.StaticMath: ' + err);
//         console.trace();
//       }
//       if (fApp.hasResultField) {
//         if ($el.attr('data-b64') !== undefined) {
//           fApp.hasSolution = true;
//           var zip = $el.attr('data-b64');
//           FAList[index].solution = decode(zip);
//         } else {
//           fApp.hasSolution = false;
//         }
//         mqEditableField = $el.find('.mq-editable-field')[0];
//         fApp.mqEditableField = mqEditableField;
//         var mf = MQ.MathField(mqEditableField, {});
//         mf.config({
//           handlers: {
//             edit: () => {
//               mqEditableField.focus();
//               // editHandler(index) does not work because index may have changed until handler is called;
//               editHandler(fApp.index);
//             },
//             enter: () => {
//               editHandler(fApp.index);
//             },
//           }
//         });
//         fApp.mathField = mf;

//         try {
//           fApp.hammer = new Hammer(mqEditableField);
//           fApp.hammer.on("doubletap", function () {
//             showVirtualKeyboard();
//           });
//         } catch (error) {
//           console.error('Hammer error: ' + error);
//         }
//       }
//     }
//     index++;
//   });
//   ($('<span class="mod">&nbsp;</span>')).insertAfter($(".formula_applet.mq-math-mode:not(.solution)"));
// }

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

$(document).on("refreshLatexEvent",
  function () {
    var lang = formulaAppletLanguage.get();
    refreshLatex(lang);
  });

function refreshLatex(lang) {
  var id;
  for (id in FAList2) {
    var fApp = FAList2[id];
    // console.log(fApp);
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