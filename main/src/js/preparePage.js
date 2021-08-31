"use strict";

/** JSDoc documentation
 * [JSDoc]{@link https://jsdoc.app/index.html} Documentation
 */

import $ from "jquery";
import Hammer from "@egjs/hammerjs";
import MQ from "./lib/mathquillWrapper.js";
import {
  domLoad
} from "./dom.js";

import config from "./config.json";
import {prepareEditorPage, setUnit, eraseUnit} from "./editor.js";

import decode from "./decode.js";
import parse, {
  FaTree,
  findCorrespondingRightBracket,
  evaluateTree,
  fillWithValues,
  checkScientificNotation
} from "./texParser.js";
import {
  initTranslation
} from "./translate.js";
import initVirtualKeyboard, {
  showVirtualKeyboard
} from "./virtualKeyboard.js";

var activeMathfieldIndex = 0;
var FAList = [];
var editHandlerActive = true;
class FApp {
  constructor() {
    this.index = '';
    this.id = '';
    this.formulaApplet = '';
    this.hasSolution = undefined;
    this.solution = '';
    this.mqEditableField = '';
    this.mathField = "";
    this.hammer = '';
    this.definitionsetList = [];
    this.precision = config.defaultPrecision;
    this.hasResultField = true;
    this.unitAuto = false;
    this.innerOri = '';
    this.replaced = '';
  }
}

export default async function preparePage() {
  await domLoad;
  $("img.mod").remove();
  ($('<button class="keyb_button">\u2328</button>')).insertAfter($(".formula_applet"));
  $('button.keyb_button').on('mousedown', function () {
    showVirtualKeyboard();
    $("button.keyb_button").removeClass('selected');
  });
  mathQuillify();
  initTranslation();

  $('body').on('click', function () {
    $(".formula_applet").removeClass('selected');
    $("button.keyb_button").removeClass('selected');
  });

  $('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    if (key == 'Tab') {
      var fa = $(ev.target).parents('.formula_applet');
      // var id = $(fa).attr('id');
      fa.click();
    }
  });
}

function keyboardEvent(cmd) {
  var fApp = FAList[activeMathfieldIndex];
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
        editHandler(activeMathfieldIndex, 'enter');
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

function nthroot() {
  var mf = FAList[activeMathfieldIndex].mathField;
  mf.cmd('\\nthroot');
  mf.typedText(' ');
  mf.keystroke('Tab');
  mf.typedText(' ');
  mf.keystroke('Left');
  mf.keystroke('Left');
  mf.keystroke('Shift-Left');
}

function getFAppFromId(id) {
  for (var i = 0; i < FAList.length; i++) {
    if (FAList[i].id == id) {
      return FAList[i];
    }
  }
}

function checkIfEqual(id, a, b, dsList) {
  var equ = a + '=' + b;
  checkIfEquality(id, equ, dsList);
}

function checkIfEquality(id, equ, dsList) {
  console.log(equ);
  var myTree = parse(equ);
  myTree = fillWithRandomValAndCheckDefSets(myTree, dsList);
  var almostOne = evaluateTree(myTree);
  var dif = Math.abs(almostOne - 1);
  var fApp = getFAppFromId(id);
  var precision = fApp.precision;
  if (dif < precision) {
    $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
  } else {
    $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
  }
}

function fillWithRandomValAndCheckDefSets(treeVar, dsList) {
  var rememberTree = JSON.stringify(treeVar);
  if (dsList.length == 0) {
    fillWithValues(treeVar);
    return treeVar;
  } else {
    // start watchdog
    var success = false;
    var start = new Date();
    var timePassedMilliseconds = 0;
    while (!success && timePassedMilliseconds < 2000) {
      var tree2 = new FaTree();
      tree2 = JSON.parse(rememberTree);
      fillWithValues(tree2);
      var variableValueList = tree2.variableValueList;
      // CheckDefinitionSets
      for (var i = 0; i < dsList.length; i++) {
        var definitionset = parse(dsList[i]);
        fillWithValues(definitionset, variableValueList);
        var value = evaluateTree(definitionset);
        success = ((value > 0) || typeof value == 'undefined');
        if (!success) {
          // short circuit
          i = dsList.length;
          // restore leafs with value = undefined
        }
      }
      var now = new Date();
      timePassedMilliseconds = now.getTime() - start.getTime();
    }
    if (!success) {
      tree2.hasValue = false;
      tree2.variableValueList = [];
    }
    return tree2;
  }
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

function editHandler(index) {
  // console.debug('called editHandler: ' + index + ' active=' + editHandlerActive);
  if (editHandlerActive == true) {
    var mf = FAList[index].mathField;
    var mfContainer = MQ.StaticMath(FAList[index].formulaApplet);
    var solution = FAList[index].solution;
    var hasSolution = FAList[index].hasSolution;
    var unitAuto = FAList[index].unitAuto;
    var id = FAList[index].id; // name of formulaApplet
    var dsList = FAList[index].definitionsetList;
    var mfLatexForParser = '';
    if (hasSolution) {
      mfLatexForParser = mf.latex();
    } else {
      mfLatexForParser = mfContainer.latex();
    }
    if (unitAuto) {
      mfLatexForParser = makeAutoUnitstring(mf);
    }

    if (hasSolution) {
      checkIfEqual(id, mfLatexForParser, solution, dsList);
    } else {
      checkIfEquality(id, mfContainer.latex(), dsList);
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

async function mathQuillify() {
  await domLoad;
  console.debug('mathQuillify()');
  initVirtualKeyboard();
  $(".formula_applet:not(.mq-math-mode)").each(function () {
    var temp = this.innerHTML;
    this.innerOri = temp;
    this.innerHTML = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
  });

  $(".formula_applet:not(.mq-math-mode)").each(function () {
    var temp = (this.innerHTML);
    temp = temp.replace(/\\Ohm/g, '\\Omega');
    temp = temp.replace(/\\mathrm/g, '');
    this.innerHTML = temp.replace(/\\unit{/g, '\\textcolor{blue}{');
    this.replaced = temp;
  });

  $(".formula_applet").each(async (index, domElem) => {
    let element = $(domElem);
    var fApp = new FApp();
    fApp.hasResultField = (element.html().indexOf('\\MathQuillMathField{}') >= 0);
    fApp.index = index;
    fApp.id = element.attr('id') // name of formulaApplet
    var isEditor = (fApp.id.toLowerCase() == 'editor');
    if (isEditor) {
      fApp.hasResultField = true;
    }
    var def = element.attr('def');
    if (typeof def !== 'undefined') {
      fApp.definitionsetList = unifyDefinitions(def);
    }
    var unitAttr = element.attr('unit');
    var unitAuto = (typeof unitAttr !== 'undefined' && unitAttr == 'auto');
    var modeAttr = element.attr('mode');
    var modePhysics = (typeof modeAttr !== 'undefined' && modeAttr == 'physics');
    fApp.unitAuto = unitAuto || modePhysics;

    var prec = element.attr('precision');
    if (typeof prec !== 'undefined') {
      prec = element.attr('prec');
    }
    prec = sanitizePrecision(prec);
    fApp.precision = prec;
    fApp.formulaApplet = domElem;

    element.click(ev => {
      if (fApp.hasResultField) {
        ev.stopPropagation(); // avoid body click
        $(".formula_applet").removeClass('selected');
        $(".formula_applet").off('customKeyboardEvent');
        element.addClass('selected');
        element.on('customKeyboardEvent', function (evnt, cmd) {
          keyboardEvent(cmd);
        });
        $("button.keyb_button").removeClass('selected');
        if ($('#virtualKeyboard').css('display') == 'none') {
          element.nextAll("button.keyb_button:first").addClass('selected');
        }
        activeMathfieldIndex = fApp.index;
      } else {
        var mfContainer = MQ.StaticMath(FAList[index].formulaApplet);
        var mfLatexForParser = mfContainer.latex();
        var myTree = new FaTree();
        myTree.leaf.content = mfLatexForParser;
      }
    })
    FAList[index] = fApp;

    console.debug('isEditor=' + isEditor);
    if (isEditor) {
      console.log(fApp);
      prepareEditorPage(fApp);
    } else {
      //******************
      // *** no editor ***
      try {
        MQ.StaticMath(domElem);
      } catch (err) {
        console.error('Error using MQ.StaticMath: ' + err);
        console.trace();
      }
      if (fApp.hasResultField) {
        if (element.attr('data-b64') !== undefined) {
          fApp.hasSolution = true;
          var zip = element.attr('data-b64');
          FAList[index].solution = decode(zip);
        } else {
          fApp.hasSolution = false;
        }
        var mqEditableField = element.find('.mq-editable-field')[0];
        var mf = MQ.MathField(mqEditableField, {});
        mf.config({
          handlers: {
            edit: () => {
              mqEditableField.focus();
              // editHandler(index) does not work because index may have changed until handler is called;
              editHandler(fApp.index);
            },
            enter: () => {
              editHandler(fApp.index);
            },
          }
        });
        fApp.mathField = mf;
      }
    }
    if (fApp.hasResultField) {
      fApp.mqEditableField = mqEditableField;
      try {
        fApp.hammer = new Hammer(mqEditableField);
        fApp.hammer.on("doubletap", function () {
          showVirtualKeyboard();
        });
    } catch (error) {
        console.info('Hammer error: ' + error);
      }
    }
    index++;
  });
  ($('<img class="mod">')).insertAfter($(".formula_applet.mq-math-mode:not(.solution)"));
}

$(document).on('mathquillifyEvent', function(){
  mathQuillify();
});


$(window).on('preparePageEvent', function(){
  console.log('preparePageEvent received');
  preparePage();
});

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

