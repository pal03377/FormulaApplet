"use strict";

import $ from "jquery";
import {
  domLoad
} from "./dom.js";
// import {
//   reloadTranslation
// } from "./translate.js";
import {
  encode
} from "./decode.js";
import {
  findCorrespondingRightBracket
} from "./texParser.js";
import MQ from "./lib/mathquillWrapper.js";
var newFaId = newFaId || 'x8rT3dkkS';

export async function initEditor() {
  await domLoad;
  var before = $('div#ed_before');
  if (before.length == 0) {
    var ed = $('.formula_applet#editor');
    ed.before('<p id="mode_select">');
    $('p#mode_select').append('  <h3><span class="tr en mw-headline" id="Mode">Mode</span><span class="tr de mw-headline" id="Mode">Modus</span></h3>');
    $('p#mode_select').append('  <input type="radio" id="auto" name="select_mode" checked />');
    var label_lse = '<label for="auto"><span class="tr en lse">Automatic (left side of equation will be compared to right side)</span>';
    label_lse += '<span class="tr de lse">Automatisch (linke und rechte Gleichungsseite werden verglichen)</span></label>';
    $('p#mode_select').append(label_lse);
    $('p#mode_select').append('  <br/>');
    $('p#mode_select').append('  <input type="radio" id="manu" name="select_mode" />');
    var label_manu = '<label for="auto"><span class="tr en manu">Manual (input will be compared with given solution)</span>';
    label_manu += '<span class="tr de manu">Manuell (Eingabe wird mit einer vorgegeben L&ouml;sung verglichen)</span></label>';
    $('p#mode_select').append(label_manu);
    ed.before('<p id="input_id">');
    $('p#input_id').append('  <label class="tr de idfa" for="fa_name">Id des Formel-Applets (4 bis 20 Zeichen)</label><label class="tr en idfa" for="fa_name">Id of Formula Applet (4 to 20 characters)</label>');
    $('p#input_id').append('  <input type="text" id="fa_name" name="fa_bla_name" required minlength="4" maxlength="20" size="10">');
    $('p#input_id').append('  <button type="button" class="tr de mfxi problemeditor" id="random-id-d">Zufalls-ID</button><button type="button" class="tr en mfxi problemeditor" id="random-id-e">Random ID</button>');
    ed.after('<hr /><textarea id="wiki-text" rows=4 cols=150></textarea>');
    var unitbuttons = '<button type="button" class="tr de peri problemeditor" id="set-unit-d">Einheit</button>';
    unitbuttons += '<button type="button" class="tr en peri problemeditor" id="set-unit-e">Unit</button>';
    unitbuttons += '<button type="button" class="tr de erau problemeditor" id="erase-unit-d">Einheit l&ouml;schen</button>';
    unitbuttons += '<button type="button" class="tr en erau problemeditor" id="erase-unit-e">Erase Unit</button>';
    ed.after(unitbuttons);
    ed.after('<button type="button" class="tr de sif problemeditor" id="set-input-d">Eingabe-Feld setzen</button><button type="button" class="tr en sif problemeditor" id="set-input-e">Set input field</button>');
    var prepend_uses = $('.prepend_uses#p_u');
    var license_link = 'https://github.com/gro58/FormulaApplet/blob/master/js/lib/ToDo.md';
    prepend_uses.after('<p><span class="tr de uses">Das Formel-Applet benutzt die Bibliotheken jQuery, MathQuill und Hammer. </span><span class="tr en uses">FormulaApplet uses jQuery, MathQuill, and Hammer. </span><a href="' + license_link + '" class="tr de moreinfo">Weitere Informationen...</a><a href="' + license_link + '" class="tr en moreinfo">More info...</a></p>');
  }
  $.event.trigger("reloadTranslationEvent");
  // await reloadTranslation();
}

export async function prepareEditorPage(fApp) {
  // *** editor ***
  await initEditor();
  // make whole mathFieldSpan editable
  var mathFieldSpan = document.getElementById('math-field');
  // var mathFieldSpan = $('p#editor.formula_applet');
  if (!mathFieldSpan) throw new Error("Cannot find math-field. The math editor must provide one.");
  var editorMf = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function () { // useful event handlers
        refreshResult(editorMf.latex())
      }
    }
  });
  fApp.mathField = editorMf;
  $.event.trigger("refreshLanguageEvent");

  // adjust events
  $('#set-input-d, #set-input-e').on('mousedown', ev => {
    ev.preventDefault();
    setInput(editorMf);
  });
  $('#set-unit-d, #set-unit-e').on('mousedown', ev => {
    ev.preventDefault();
    console.log(editorMf);
    setUnit(editorMf);
  });
  $('#erase-unit-d, #erase-unit-e').on('mousedown', ev => {
    ev.preventDefault();
    eraseUnit(editorMf);
  });
  $('#random-id-d, #random-id-e').on('mousedown', ev => {
    ev.preventDefault();
    var rId = makeid(8);
    document.getElementById('fa_name').value = rId;
    newFaId = rId;
    refreshResult(editorMf.latex())
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
      refreshResult(editorMf.latex())
    }
  });

  $('input[type="radio"]').on('click', ev => {
    var resultMode = ev.target.id;
    if (resultMode == 'auto') {
      $('p#editor span.mq-class.inputfield').prop('contentEditable', 'false');
      autoMode.set(true);
      refreshResult(editorMf.latex())
    }
    if (resultMode == 'manu') {
      $('p#editor span.mq-class.inputfield').prop('contentEditable', 'true');
      autoMode.set(false);
      refreshResult(editorMf.latex())
    }
  });
  $('#random-id-d').mousedown();
  // $('input[type="radio"]#manu').click();
  $('input[type="radio"]#auto').click();
}

function getSelection(mf, options) {
  // if options.erase is undefined, erase defaults to false
  var erase = options.erase || false;
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
    var result = [preSelected, selected, postSelected, ori];
    console.log('selection: ' + result);
    return result;
  }
}

function setInput(editorMf) {
  // var latex = editorMf.latex();
  // console.log(latex);
  // latex = eraseClass(latex);
  // console.log(latex);
  // editorMf.latex(latex);
  var temp = getSelection(editorMf, {
    erase: true
  });
  var preSelected = temp[0];
  var selected = temp[1];
  var postSelected = temp[2];
  var newLatex = temp[3];
  if (selected.length > 0) {
    newLatex = preSelected + '\\class{inputfield}{' + selected + '}' + postSelected;
  } else {
    newLatex = sanitizeInputfieldTag(newLatex);
  }
  editorMf.latex(newLatex);
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
      pos++;
    }
  } while (pos >= 0)
  return {
    sofUnitTags: startOfUnitTags,
    eofUnitTags: endOfUnitTags
  };
}

export function setUnit(mf) {
  var i, k;
  var unitTag = '\\textcolor{blue}{';
  // erase class inputfield = false
  var temp = getSelection(mf, {
    erase: false
  });
  var preSelected = temp[0];
  var selected = temp[1];
  var postSelected = temp[2];
  var ori = temp[3];

  var start = preSelected.length;
  var end = start + selected.length;
  var selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (k = start; k < end; k++) {
    selectpattern[k] = 's';
  }

  var posn = getPositionOfUnitTags(ori, unitTag);
  var startOfUnitTags = posn.sofUnitTags;
  var endOfUnitTags = posn.eofUnitTags;
  var pattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (i = 0; i < startOfUnitTags.length; i++) {
    for (k = startOfUnitTags[i]; k < endOfUnitTags[i]; k++) {
      pattern[k] = '#';
    }
  }
  // inspect selection start
  for (i = 0; i < startOfUnitTags.length; i++) {
    if (startOfUnitTags[i] < start && start <= endOfUnitTags[i]) {
      // move start leftwards
      start = startOfUnitTags[i];
      // short circuit:
      i = startOfUnitTags.length;
    }
  }
  // inspect selection end
  for (i = 0; i < startOfUnitTags.length; i++) {
    if (startOfUnitTags[i] <= end && end <= endOfUnitTags[i]) {
      // move end rightwards
      end = endOfUnitTags[i];
      // short circuit:
      i = startOfUnitTags.length;
    }
  }
  // debug
  selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (k = start; k < end; k++) {
    selectpattern[k] = 's';
  }

  // delete unittags inside selection
  var ori_array = ori.split('');
  for (i = 0; i < startOfUnitTags.length; i++) {
    if (start <= startOfUnitTags[i] && endOfUnitTags[i] <= end) {
      for (k = startOfUnitTags[i]; k < startOfUnitTags[i] + unitTag.length; k++) {
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
  } else {
    newLatex = ori.replace(/§/g, '');
  }
  mf.latex(sanitizeInputfieldTag(newLatex));
}

export function sanitizeInputfieldTag(latex){
  // first make shorter
  var result = latex.replace('\\class{inputfield}{','\\class{');
  // then make longer again
  result = result.replace('\\class{','\\class{inputfield}{');
  return result;
}

export function eraseUnit(mf) {
  var unitTag = '\\textcolor{blue}{';
  var temp = getSelection(mf, {
    erase: false
  });
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
  // restore selection-checked mf
  mf.latex(sanitizeInputfieldTag(ori));
}

/**
 * 
 * @param {string} latex string containing latex code
 * @returns {object} object consisting of three strings: before, tag, after
 * @example result = separateInputfield("bli\\class{inputfield}{bla}blu"), then
 * @example result.before = "bli", result.tag = "bla", result.after = "blu"
 * @example result = separateInputfield("stringwithoutrinputfield"), then
 * @example result.before = "", result.tag = "", result.after = "stringwithoutrinputfield"
 */
function separateInputfield(latex) {
  var beforeTag, tag, afterTag;
  var classTag = '\\class{inputfield}{';
  var pos = latex.indexOf(classTag);
  if (pos > -1) {
    beforeTag = latex.substring(0, pos);
    var rest = latex.substring(pos + classTag.length - 1);
    // rest starts with {
    var bracket = findCorrespondingRightBracket(rest, '{');
    if (bracket.leftPos !== 0 || bracket.bracketLength !== 1 || bracket.rightBracketLength !== 1) {
      console.error('Something went wront at separateInputfield()', bracket);
    }
    tag = rest.substring(1, bracket.rightPos);
    afterTag = rest.substring(bracket.rightPos + 1);
  } else {
    beforeTag = '';
    tag = '';
    afterTag = latex;
  }
  var result = {
    before: beforeTag,
    tag: tag,
    after: afterTag
  };
  return result;
}

function eraseClass(latex) {
  // latex = 'abc+class{def}+ghi';
  // temp = ['abc+', 'def', '+ghi'];
  var temp = separateInputfield(latex);
  return temp.before + temp.tag + temp.after;
}

const autoMode = {
  auto: true,
  set: function (truefalse) {
    this.auto = truefalse
  },
  get: function () {
    return this.auto
  }
}

function refreshResult(latex) {
  console.log(latex);
  showEditorResults(separateInputfield(latex));
}

function showEditorResults(parts) {
  var result = '<p class="formula_applet"';
  // var editable = $('p#editor span.mq-class.inputfield').prop('contentEditable');
  var resultMode;
  if (autoMode.get()) {
    resultMode = 'auto';
  } else {
    resultMode = 'manu';
  }
  var common_result = ' id="' + newFaId;
  if (resultMode == 'manu') {
    common_result += '" data-b64="' + encode(parts.tag);
  }
  common_result += '">';
  common_result += parts.before;
  common_result += '{{result}}';
  common_result += parts.after;
  common_result = common_result.replace(/\\textcolor{blue}{/g, '\\unit{');
  result += common_result + '</p>';

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
    i++;
    if (i > separators.length) {
      cont = false;
      sep = 'no replacement char found';
    }
  } while (cont)
  return sep;
}