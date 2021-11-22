"use strict";

import $ from "jquery";
import {
  domLoad,
  findDoc
} from "./dom.js";
// import {
//   clickLanguage
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
  $.event.trigger("clickLanguageEvent");
  // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
  document.addEventListener('setInputEvent', function (ev) {
    console.log(ev);
    // var d = ev.data;
    console.log('RECEIVE setInputEvent (editor.js)');
  });
  // console.log('LISTEN setInputEvent (editor.js)');
}

function mathQuillifyEditor() {
  // make whole mathFieldSpan editable
  var mathFieldSpan = findDoc().getElementById('math-field');
  // console.log('mathFieldSpan.textContent=' + mathFieldSpan.textContent);
  if (!mathFieldSpan) throw new Error("Cannot find math-field. The math editor must provide one.");
  var editorMf = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function (mathField) { // useful event handlers
        try {
          var latex = mathField.latex();
          console.log('** mathQuillEditHandler latex=' + latex);
          refreshResultField(latex);
        } catch (error) {
          console.error('ERROR in MQ.MathField: ' + error);
        }
      }
    }
  });
return editorMf;
}

export async function prepareEditorApplet(fApp) {
  // *** editor ***
  await initEditor();
  console.log('preparePage.js: prepareEditorApplet');
  var editorMf = mathQuillifyEditor();
  fApp.mathField = editorMf;
  console.log('editorMf.latex=' + editorMf.latex());
  refreshResultField(editorMf.latex());
  $.event.trigger("refreshLatexEvent");  //adjust \cdot versus \times

  // adjust events
  $(findDoc()).find('#set-input-d, #set-input-e').on('mousedown', ev => {
    ev.preventDefault();
    setInput(editorMf);
  });

  $(findDoc()).find('#set-unit-d, #set-unit-e').on('mousedown', ev => {
    ev.preventDefault();
    setUnit(editorMf);
  });
  $(findDoc()).find('#erase-unit-d, #erase-unit-e').on('mousedown', ev => {
    ev.preventDefault();
    eraseUnit(editorMf);
  });
  $(findDoc()).find('#random-id-d, #random-id-e').on('mousedown', ev => {
    ev.preventDefault();
    var rId = makeid(8);
    document.getElementById('fa_name').value = rId;
    newFaId = rId;
    refreshResultField(editorMf.latex())
  });

  $(findDoc()).find('#fa_name').on('input', ev => {
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
      refreshResultField(editorMf.latex())
    }
  });

  $(findDoc()).find('input[type="radio"]').on('click', ev => {
    var resultMode = ev.target.id;
    if (resultMode == 'auto') {
      // $(findDoc()).find('p#editor span.mq-class.inputfield').prop('contentEditable', 'false');
      $(findDoc()).find('p.edit span.mq-class.inputfield').prop('contentEditable', 'false');
      autoMode.set(true);
      refreshResultField(editorMf.latex())
    }
    if (resultMode == 'manu') {
      // $(findDoc()).find('p#editor span.mq-class.inputfield').prop('contentEditable', 'true');
      $(findDoc()).find('p.edit span.mq-class.inputfield').prop('contentEditable', 'true');
      autoMode.set(false);
      refreshResultField(editorMf.latex())
    }
  });
  // generate a new random ID
  $(findDoc()).find('#random-id-d').trigger('mousedown');
  // $(findDoc()).find('input[type="radio"]#manu').click();
  $(findDoc()).find('input[type="radio"]#auto').trigger('click');
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
    return result;
  }
}

function setInput(editorMf) {
    console.log('setInput!!!');
}

function setInputinactive(editorMf) {
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

export function sanitizeInputfieldTag(latex) {
  var result;
  if (typeof latex === 'undefined') {
    result = '';
  } else {
    // first make shorter
    result = latex.replace('\\class{inputfield}{', '\\class{');
    // then make longer again
    result = result.replace('\\class{', '\\class{inputfield}{');
    return result;
  }
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
  // console.log('separate ' + latex);
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
  console.info(latex);
  console.info(beforeTag + '|' + tag + '|' + afterTag);
  return result;
}

function eraseClass(latex) {
  // latex = 'abc\\class{inputfield}{def}ghi';
  // temp = ['abc+', 'def', '+ghi'];
  // return 'abcdefghi';
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

function refreshResultField(latex) {
  // console.log('refreshResultField latex=' + latex);
  var parts = separateInputfield(latex);
  showEditorResults(parts);
}

function showEditorResults(parts) {
  var tex = parts.before + '{{result}}' + parts.after;
  tex = tex.replace(/\\textcolor{blue}{/g, '\\unit{');
  // $(findDoc()).find(document).trigger('texevent');

  // maybe H5P editor
  var texinput = $(findDoc()).find('div.field.field-name-TEX_expression.text input')[0];
  if (typeof texinput !== 'undefined') {
    // value of TEX_expression field is set to EditorResult
    texinput.value = tex;
    // trigger InputEvent. EventListener see formulaapplet-editor.js
    texinput.dispatchEvent(new InputEvent('input', {
      bubbles: true
    }))
  } else {
    console.log('no TEX_expression found - probably no H5P');
  }
  // maybe html editor
  var out = $(findDoc()).find('textarea#html-output');
  if (typeof out !== 'undefined') {
    out.text(getHTML(tex, parts.tag));
  }
}

function getHTML(tex, tag) {
  var result = '<p class="formula_applet"';
  // var editable = $(findDoc()).find('p#editor span.mq-class.inputfield').prop('contentEditable');
  var resultMode;
  if (autoMode.get()) {
    resultMode = 'auto';
  } else {
    resultMode = 'manu';
  }
  var common_result = ' id="' + newFaId;
  if (resultMode == 'manu') {
    common_result += '" data-b64="' + encode(tag);
  }
  common_result += '">';
  common_result += tex;
  result += common_result + '</p>';
  return result;
}

function makeid(length) {
  var result = 'fa';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-_.-_.-';
  var numOfChars = characters.length;
  for (var i = 2; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * numOfChars));
  }
  // result = '"' + result + '"';
  return result;
}

document.h5p_transfer = {
  makeid
};

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