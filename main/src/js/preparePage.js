"use strict";

import $ from "jquery";
import Hammer from "@egjs/hammerjs";
import MQ from "./lib/mathquillWrapper.js";
import { domLoad } from "./dom.js";

import config from "./config.json";

import { encode, decode } from "./decode.js";
import { initEditor } from "./editor.js";
import parse, { FaTree, findCorrespondingRightBracket, evaluateTree, fillWithValues, checkScientificNotation } from "./texParser.js";
import { initTranslation } from "./translate.js";
import initVirtualKeyboard, { showVirtualKeyboard } from "./virtualKeyboard.js";

var activeMathfieldIndex = 0;
var FAList = [];
var newFaId = 'x8rT3dkkS';
var resultMode = '';
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
  $('button.keyb_button').on('mousedown', function (ev) {
    showVirtualKeyboard();
    $("button.keyb_button").removeClass('selected');
  });
  ($('<img class="mod">')).insertAfter($(".formula_applet"));
  mathQuillify();
  initTranslation();

  $('body').on('click', function (ev) {
    $(".formula_applet").removeClass('selected');
    $("button.keyb_button").removeClass('selected');
  });

  $('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    if (key == 'Tab') {
      var fa = $(ev.target).parents('.formula_applet');
      var id = $(fa).attr('id');
      fa.click();
    }
  });
}

export function keyboardEvent(cmd) {
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
        setUnit();
      } else if (cmd == 'eraseUnit') {
        eraseUnit();
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
    if (success) {
    } else {
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
      var mfLatexForParser = csn.repl + unitTag + middle + right + '}';
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
      var sci = checkScientificNotation(beginning).isScientific;
      if (sci) {
        break;
      }
    }
    if (beginning.length > 0) {
      var rest = str.substr(beginning.length);
      if (rest.length > 0) {
        var newLatex = beginning + unitTag + rest + '}';
        var mfLatexForParser = csn.repl + unitTag + rest + '}';
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
  console.debug('called editHandler: ' + index + ' active=' + editHandlerActive);
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
};

var editorMf;

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
        element.addClass('selected');
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
      // *** editor ***
      await initEditor();
      // make whole mathFieldSpan editable
      var mathFieldSpan = document.getElementById('math-field');
      if (!mathFieldSpan) throw new Error("Cannot find math-field. The math editor must provide one.");
      editorMf = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true, // configurable
        handlers: {
          edit: function () { // useful event handlers
            showEditorResults(editorEditHandler(editorMf.latex()));
          }
        }
      });
      fApp.mathField = editorMf;

      var mqEditableField = $('#editor').find('.mq-editable-field')[0];
      // adjust events
      $('#set-input-d, #set-input-e').on('mousedown', ev => {
        ev.preventDefault();
        setInput();
      });
      $('#set-unit-d').on('mousedown', ev => {
        ev.preventDefault();
        setUnit();
      });
      $('#set-unit-e, #set-unit-e').on('mousedown', ev => {
        ev.preventDefault();
        setUnit();
      });
      $('#erase-unit-d, #erase-unit-e').on('mousedown', ev => {
        ev.preventDefault();
        eraseUnit();
      });
      $('#random-id-d, #random-id-e').on('mousedown', ev => {
        ev.preventDefault();
        var rId = makeid(8);
        document.getElementById('fa_name').value = rId;
        newFaId = rId;
        showEditorResults(editorEditHandler(editorMf.latex()));
      });

      $('#fa_name').on('input', ev => {
        var fa_name = ev.target.value;
        // avoid XSS
        fa_name = fa_name.replace(/</g, '');
        fa_name = fa_name.replace(/>/g, '');
        fa_name = fa_name.replace(/"/g, '');
        fa_name = fa_name.replace(/'/g, '');
        fa_name = fa_name.replace(/&/g, '');
        fa_name = fa_name.replace(/ /g, '_');
        if (4 <= fa_name.length && fa_name.length <= 20) {
          newFaId = fa_name;
          showEditorResults(editorEditHandler(editorMf.latex()));
        }
      });

      $('input[type="radio"]').on('click', ev => {
        resultMode = ev.target.id;
        if (resultMode == 'auto') {
          $('span.mq-class.inputfield').prop('contentEditable', 'false');
          showEditorResults(editorEditHandler(editorMf.latex()));
        }
        if (resultMode == 'manu') {
          $('span.mq-class.inputfield').prop('contentEditable', 'true');
          showEditorResults(editorEditHandler(editorMf.latex()));
        }
      });
      $('#random-id-d').mousedown();
      // $('input[type="radio"]#manu').click();
      $('input[type="radio"]#auto').click();
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
        };
        var mqEditableField = element.find('.mq-editable-field')[0];
        var mf = MQ.MathField(mqEditableField, {});
        mf.config({
          handlers: {
            edit: () => {
              mqEditableField.focus();
              editHandler(index);
            },
            enter: () => {
              editHandler(index);
            },
          }
        });
        fApp.mathField = mf;
      }
    }
    if (fApp.hasResultField) {
      fApp.mqEditableField = mqEditableField;
      fApp.hammer = new Hammer(mqEditableField);
      fApp.hammer.on("doubletap", function (ev) {
        showVirtualKeyboard();
      });
    }
    index ++;
  });
}

function unifyDefinitions(def) {
  def = def.replace(/\s/g, "");
  def = def.replace(/\&&/g, "&");
  var dsList = def.split("&");
  for (var i = 0; i < dsList.length; i++) {
    var ds = dsList[i];
    var result = '';
    if (ds.indexOf('>') > -1) {
      var temp = ds.split('>');
      if (temp[1] == '0') {
        result = temp[0];
      } else {
        result = temp[0] + '-' + temp[1];
      }
    }
    if (ds.indexOf('<') > -1) {
      var temp = ds.split('<');
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

function getSelection(mf, options) {
  var erase = options.erase || false;
  // typof mf = mathField
  var ori = mf.latex();
  var erased = ori;
  if (erase) {
    erased = eraseClass(ori);
  }
  var replacement = createReplacement(ori);
  if (ori.indexOf(replacement) == -1) {
    // replacement has to be done before erase of class{...
    // Do replacement!
    mf.typedText(replacement);
    // erase class{inputfield}
    var replacedAndErased = mf.latex();
    if (erase) {
      replacedAndErased = eraseClass(replacedAndErased);
    }
    var preSelected = '?';
    var selected = '?';
    var postSelected = '?';
    var pos = replacedAndErased.indexOf(replacement);
    preSelected = replacedAndErased.substring(0, pos);
    // selected = replacement
    postSelected = replacedAndErased.substring(pos + replacement.length);
    // Delete preSelected from beginning of erased
    // and delete postSelected from end of erased
    var check = erased.substr(0, preSelected.length);
    if (check !== preSelected) {
      console.error('Something went wrong with replacement of input field', check, preSelected);
    }
    erased = erased.substring(preSelected.length);
    check = erased.substring(erased.length - postSelected.length);
    if (check !== postSelected) {
      console.error('Something went wrong with replacement of input field', check, postSelected);
    }
    selected = erased.substring(0, erased.length - postSelected.length);
    return [preSelected, selected, postSelected, ori];
  }
}

function setInput() {
  var temp = getSelection(editorMf, { erase: true });
  var preSelected = temp[0];
  var selected = temp[1];
  var postSelected = temp[2];
  var ori = temp[3];
  if (selected.length > 0) {
    var newLatex = preSelected + '\\class{inputfield}{' + selected + '}' + postSelected;
    editorMf.latex(newLatex);
  } else {
    ori = ori.replace('class{', '\\class{inputfield}{');
    editorMf.latex(ori);
  }
}

function getPositionOfUnitTags(latex, unitTag) {
  // get position of exising unit tags
  var pos = 0;
  var startOfUnitTags = [];
  var endOfUnitTags = [];
  do {
    pos = latex.indexOf(unitTag, pos);
    if (pos >= 0) {
      var rest = latex.substr(pos + unitTag.length - 1);
      var bracket = findCorrespondingRightBracket(rest, '{');
      var posRightBracket = pos + unitTag.length + bracket.rightPos;
      startOfUnitTags.push(pos);
      endOfUnitTags.push(posRightBracket);
      //posRightBracket points to char right of the right bracket
      pos ++;
    }
  } while (pos >= 0)
  return {
    sofUnitTags: startOfUnitTags,
    eofUnitTags: endOfUnitTags
  };
}

function setUnit() {
  var unitTag = '\\textcolor{blue}{';
  var mf = FAList[activeMathfieldIndex].mathField;
  // erase class inputfield = false
  var temp = getSelection(mf, { erase: false });
  var preSelected = temp[0];
  var selected = temp[1];
  var postSelected = temp[2];
  var ori = temp[3];

  var start = preSelected.length;
  var end = start + selected.length;
  var selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var k = start; k < end; k++) {
    selectpattern[k] = 's';
  }

  var posn = getPositionOfUnitTags(ori, unitTag);
  var startOfUnitTags = posn.sofUnitTags;
  var endOfUnitTags = posn.eofUnitTags;
  var pattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var i = 0; i < startOfUnitTags.length; i++) {
    for (var k = startOfUnitTags[i]; k < endOfUnitTags[i]; k++) {
      pattern[k] = '#';
    }
  }
  // inspect selection start
  for (var i = 0; i < startOfUnitTags.length; i++) {
    if (startOfUnitTags[i] < start && start <= endOfUnitTags[i]) {
      // move start leftwards
      start = startOfUnitTags[i];
      // short circuit:
      i = startOfUnitTags.length;
    }
  }
  // inspect selection end
  for (var i = 0; i < startOfUnitTags.length; i++) {
    if (startOfUnitTags[i] <= end && end <= endOfUnitTags[i]) {
      // move end rightwards
      end = endOfUnitTags[i];
      // short circuit:
      i = startOfUnitTags.length;
    }
  }
  // debug
  var selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var k = start; k < end; k++) {
    selectpattern[k] = 's';
  }

  // delete unittags inside selection
  var ori_array = ori.split('');
  for (var i = 0; i < startOfUnitTags.length; i++) {
    if (start <= startOfUnitTags[i] && endOfUnitTags[i] <= end) {
      for (var k = startOfUnitTags[i]; k < startOfUnitTags[i] + unitTag.length; k++) {
        ori_array[k] = '§';
      }
      ori_array[endOfUnitTags[i] - 1] = '§';
    }
  }
  ori = ori_array.join('');

  if (selected.length > 0) {
    // new calculation necessary
    preSelected = ori.substring(0, start);
    selected = ori.substring(start, end);
    postSelected = ori.substring(end);
    var newLatex = preSelected + unitTag + selected + '}' + postSelected;
    // newLatex = newLatex.replace(/\xA7/g, '');
    newLatex = newLatex.replace(/§/g, '');
    newLatex = newLatex.replace('class{', '\\class{inputfield}{');
    mf.latex(newLatex);
  } else {
    ori = ori.replace('class{', '\\class{inputfield}{');
    mf.latex(ori);
  }
}

function eraseUnit() {
  var unitTag = '\\textcolor{blue}{';
  var mf = FAList[activeMathfieldIndex].mathField;
  var temp = getSelection(mf, { erase: false });
  var ori = temp[3];
  // get position of unittags
  var posn = getPositionOfUnitTags(ori, unitTag);
  var startOfUnitTags = posn.sofUnitTags;
  var endOfUnitTags = posn.eofUnitTags;

  // delete unittag outside cursor (or left boundary of selection)
  var cursorpos = temp[0].length;
  var ori_array = ori.split('');
  for (var i = 0; i < startOfUnitTags.length; i++) {
    if (startOfUnitTags[i] <= cursorpos && cursorpos <= endOfUnitTags[i]) {
      for (var k = startOfUnitTags[i]; k < startOfUnitTags[i] + unitTag.length; k++) {
        ori_array[k] = '§';
      }
      ori_array[endOfUnitTags[i] - 1] = '§';
    }
  }
  ori = ori_array.join('');
  ori = ori.replace(/§/g, '');
  ori = ori.replace('class{', '\\class{inputfield}{');
  // restore selection-checked mf
  mf.latex(ori);
}

function separateClass(latex, classTag) {
  var before_tag = '';
  var tag = '';
  var afterTag = '';
  var pos = latex.indexOf(classTag); //)
  if (pos > -1) {
    before_tag = latex.substring(0, pos);
    var rest = latex.substring(pos + classTag.length - 1);
    // rest starts with {
    var bracket = findCorrespondingRightBracket(rest, '{');
    // bracket = [leftPos, bra.length, rightPos, rightbra.length]
    if (bracket.leftPos !== 0 || bracket.bracketLength !== 1 || bracket.rightBracketLength !== 1) {
      console.error('Something went wront at separateClass()', bracket);
    }
    tag = rest.substring(1, bracket.rightPos);
    afterTag = rest.substring(bracket.rightPos + 1);
  } else {
    before_tag = '';
    tag = '';
    afterTag = latex;
  }
  return [before_tag, tag, afterTag];
}

function editorEditHandler(latex) {
  $('#output-code-0').text(latex);
  return separateClass(latex, 'class{');
}

function eraseClass(latex) {
  // latex = 'abc+class{def}+ghi';
  // temp = ['abc+', 'def', '+ghi'];
  var temp = editorEditHandler(latex);
  return temp[0] + temp[1] + temp[2];
}

function showEditorResults(parts) {
  var result = '<p class="formula_applet"';
  var common_result = ' id="' + newFaId;
  if (resultMode == 'manu') {
    common_result += '" data-b64="' + encode(parts[1]);
  }
  common_result += '">';
  common_result += parts[0];
  common_result += '{{result}}';
  common_result += parts[2];
  common_result = common_result.replace(/\\textcolor{blue}{/g, '\\unit{');
  result += common_result + '</p>';

  $('#output-code-1').text(parts[1]);
  $('#output-code-2').text(result);
  var out = $('textarea#wiki-text');
  if (out.length > 0) {
    out.text(result);
  }
}

function makeid(length) {
  var result = '';
  // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-!%_+-!%_+-!%';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-!%';
  var numOfChars = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * numOfChars));

  }
  // result = '"' + result + '"';
  return result;
}

function createReplacement(latexstring) {
  const separators = '∀µ∉ö∋∐∔∝∤∮∱∸∺∽≀';
  var i = 0;
  sep = '';
  do {
    var sep = separators[i];
    var found = (latexstring.indexOf(sep) > -1);
    var cont = found;
    i ++;
    if (i > separators.length) {
      cont = false;
      sep = 'no replacement char found';
    }
  } while (cont)
  return sep;
}