// "use strict";

import $ from "jquery";
import MQ from "./lib/mathquillWrapper.js";
import { domLoad } from "./dom.js";

import { encode, decode } from "./decode.js";
import { prepend } from "./editor.js";
import parse, { fa_tree, find_corresponding_right_bracket, evaluateTree, fillWithValues, checkScientificNotation } from "./tex_parser.js";
import { initTranslation } from "./translate.js";
import virtualKeyboard_init, { virtualKeyboard_show } from "./virtual_keyboard.js";

var default_precision = 0.000001;
var activeMathfieldIndex = 0;
var FAList = [];
var new_fa_id = 'x8rT3dkkS';
var result_mode = '';
var editHandlerActive = true;
class FAPP {
  constructor() {
    this.index = '';
    this.id = '';
    this.formula_applet = '';
    this.hasSolution = undefined;
    this.solution = '';
    this.mqEditableField = '';
    this.mathField = "";
    this.hammer = '';
    this.definitionset_list = [];
    this.precision = default_precision;
    this.hasResultField = true;
    this.unit_auto = false;
    this.inner_ori = '';
    this.replaced = '';
  }
}

export default async function prepare_page() {
  await domLoad;
  $("img.mod").remove();
  ($('<button class="keyb_button">\u2328</button>')).insertAfter($(".formula_applet"));
  $('button.keyb_button').on('mousedown', function (ev) {
    virtualKeyboard_show();
    $("button.keyb_button").removeClass('selected');
  });
  ($('<img class="mod">')).insertAfter($(".formula_applet"));
  $(document).ready(function () {
    console.log('Document ready. Calling mathquillify...');
    mathQuillify();
    //inittranslation after mathQuillify which evokes virtualKeyboard_init
    if (typeof initTranslation !== 'undefined') {
      initTranslation();
    }
  })

  $('body').on('click', function (ev) {
    //console.log('body click');
    $(".formula_applet").removeClass('selected');
    $("button.keyb_button").removeClass('selected');
  });

  $('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    // console.log(ev);
    // console.log(kev.key, kev.metaKey, kev.ctrlKey);
    if (key == 'Tab') {
      var fa = $(ev.target).parents('.formula_applet');
      var id = $(fa).attr('id');
      fa.click();
    }
  });
}

export function keyboardEvent(cmd) {
  var FApp = FAList[activeMathfieldIndex];
  var mf = FApp.mathField;

  if (typeof mf !== 'undefined') {
    //console.log(cmd);
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
      } else if (cmd == 'set_unit') {
        set_unit();
      } else if (cmd == 'erase_unit') {
        erase_unit();
      } else if (cmd == 'nthroot') {
        nthroot();
      } else if (cmd == 'square') {
        mf.keystroke("Up");
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

function FApp_from_id(id) {
  for (var i = 0; i < FAList.length; i++) {
    if (FAList[i].id == id) {
      return FAList[i];
    }
  }
}

function check_if_equal(id, a, b, ds_list) {
  // console.log(a + ' ?=? ' + b);
  var equ = a + '=' + b;
  check_if_equality(id, equ, ds_list);
}

function check_if_equality(id, equ, ds_list) {
  var myTree = parse(equ);
  myTree = fillWithRandomValAndCheckDefSets(myTree, ds_list);
  var almostOne = evaluateTree(myTree);
  var dif = Math.abs(almostOne - 1);
  // console.log('dif=' + dif);
  var FApp = FApp_from_id(id);
  var precision = FApp.precision;
  if (dif < precision) {
    $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
  } else {
    $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
  }
}

function fillWithRandomValAndCheckDefSets(tree_var, ds_list) {
  // console.log('save');
  var rememberTree = JSON.stringify(tree_var);
  if (ds_list.length == 0) {
    fillWithValues(tree_var);
    return tree_var;
  } else {
    // start watchdog
    var start = new Date();
    var success = true;
    var numberOfTries = 0;
    do {
      numberOfTries++;
      var tree2 = new fa_tree();
      tree2 = JSON.parse(rememberTree);
      // console.log('restore');
      fillWithValues(tree2);
      var variable_value_list = tree2.variable_value_list;
      // console.log('fill');
      // CheckDefinitionSets
      for (var i = 0; i < ds_list.length; i++) {
        var definitionset = parse(ds_list[i]);
        fillWithValues(definitionset, variable_value_list);
        var value = evaluateTree(definitionset);
        success = ((value > 0) || typeof value == 'undefined');
        if (success == false) {
          // short circuit
          i = ds_list.length;
          // restore leafs with value = undefined
        }
      }
      var now = new Date();
      var timePassed = now.getTime() - start.getTime();
      // in milliseconds
    }
    while (success == false && timePassed < 2000);
    // console.log('numberOfTries=' + numberOfTries);
    if (success == true) {
      // console.log('filled with success. Time= ' + timePassed);
    } else {
      tree2.hasValue = false;
      tree2.variable_value_list = [];
    }
    return tree2;
  }
}

function make_auto_unitstring(mf) {
  // mf = MathField
  var str = mf.latex();
  var mf_latex_for_parser = str;
  // console.log('make_auto_unitstring ' + str);
  var unit_tag = '\\textcolor{blue}{';
  var pos = str.indexOf(unit_tag);
  if (pos >= 0) {
    var left = str.substr(0, pos);
    // rest has to start with {
    var rest = str.substr(pos + unit_tag.length - 1);
    var bracket = find_corresponding_right_bracket(rest, '{');
    var middle = rest.substring(1, bracket.right_pos);
    var right = rest.substr(bracket.right_pos + 1);
    // console.log(left + '|' + middle + '|' + right);
    var sci = checkScientificNotation(left).isScientific;
    if (sci == true && middle.length > 0) {
      // expand the unit tag at the right side
      var new_latex = left + unit_tag + middle + right + '}';
      var mf_latex_for_parser = csn.repl + unit_tag + middle + right + '}';
      console.log('new_latex=' + new_latex);
      console.log('mf_latex_for_parser=' + mf_latex_for_parser);
      editHandlerActive = false;
      mf.latex(new_latex);
      mf.keystroke('Left');
      editHandlerActive = true;
    } else {
      //console.log('Do not expand.');
    }
  } else {
    // maybe create unit tag
    var beginning = '';
    for (var i = str.length; i >= 0; i--) {
      beginning = str.substr(0, i);
      var sci = checkScientificNotation(beginning).isScientific;
      // console.log(beginning + ' sci=' + sci);
      if (sci == true) {
        i = -1;
      }
    }
    if (beginning.length > 0) {
      var rest = str.substr(beginning.length);
      // console.log(beginning + '|' + rest);
      if (rest.length > 0) {
        // console.log('Make unit of ' + rest);
        var new_latex = beginning + unit_tag + rest + '}';
        var mf_latex_for_parser = csn.repl + unit_tag + rest + '}';
        console.log('new_latex=' + new_latex);
        console.log('mf_latex_for_parser=' + mf_latex_for_parser);
        editHandlerActive = false;
        mf.latex(new_latex);
        mf.keystroke('Left');
        editHandlerActive = true;
      }
    } else {
      // do nothing
    }
  }
  return mf_latex_for_parser;
}

function editHandler(index) {
  console.log('called editHandler: ' + index + ' active=' + editHandlerActive);
  if (editHandlerActive == true) {
    var mf = FAList[index].mathField;
    var mf_container = MQ.StaticMath(FAList[index].formula_applet);
    var solution = FAList[index].solution;
    var hasSolution = FAList[index].hasSolution;
    var unit_auto = FAList[index].unit_auto;
    var id = FAList[index].id; // name of formula_applet
    var ds_list = FAList[index].definitionset_list;
    // console.log(mf.latex() + ' unit_auto=' + unit_auto);
    var mf_latex_for_parser = '';
    if (hasSolution) {
      mf_latex_for_parser = mf.latex();
    } else {
      mf_latex_for_parser = mf_container.latex();
    }
    if (unit_auto) {
      mf_latex_for_parser = make_auto_unitstring(mf);
    }

    // the following part: auto_unit does not matter
    if (hasSolution) {
      check_if_equal(id, mf_latex_for_parser, solution, ds_list);
    } else {
      check_if_equality(id, mf_container.latex(), ds_list);
      // mf_latex_for_parser = mf_container.latex();
    }
    if (typeof editHandlerDebug == 'undefined') {
      console.log('editHandlerDebug() is undefined');
    } else {
      // see sample_task_and_parse.php
      try {
        document.getElementById('output_2').innerHTML = mf_latex_for_parser;
        editHandlerDebug(mf_latex_for_parser);
      } catch {
        console.log('no output_2');
      }
    }
  }
};

var editor_mf = '';

function sanitizePrecision(prec) {
  if (typeof prec == 'undefined') {
    prec = default_precision;
  } else {
    prec = prec.replace(/,/g, '.');
    var endsWithPercent = (prec.substr(prec.length - 1) == '%');
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
  console.log('mathQuillify()');
  virtualKeyboard_init();
  $(".formula_applet:not(.mq-math-mode)").each(function () {
    var temp = (this.innerHTML);
    this.inner_ori = temp;
    this.innerHTML = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
  });

  $(".formula_applet:not(.mq-math-mode)").each(function () {
    var temp = (this.innerHTML);
    temp = temp.replace(/\\Ohm/g, '\\Omega');
    temp = temp.replace(/\\mathrm/g, '');
    this.innerHTML = temp.replace(/\\unit{/g, '\\textcolor{blue}{');
    this.replaced = temp;
    console.log('replaced=' + this.innerHTML);
  });

  $(".formula_applet").each((index, domElem) => {
    let element = $(domElem);
    var FApp = new FAPP();
    FApp.hasResultField = (element.html().indexOf('\\MathQuillMathField{}') >= 0);
    FApp.index = index;
    FApp.id = element.attr('id') // name of formula_applet
    var isEditor = (FApp.id.toLowerCase() == 'editor');
    if (isEditor) {
      FApp.hasResultField = true;
    }
    // console.log('§§§ ' + this.innerHTML + ' ' + FApp.hasResultField);
    var def = element.attr('def');
    if (typeof def !== 'undefined') {
      FApp.definitionset_list = unify_definitionsets(def);
    }
    var unit_attr = element.attr('unit');
    var unit_auto = (typeof unit_attr !== 'undefined' && unit_attr == 'auto');
    var mode_attr = element.attr('mode');
    var mode_physics = (typeof mode_attr !== 'undefined' && mode_attr == 'physics');
    FApp.unit_auto = unit_auto || mode_physics;
    // console.info(`${FApp.id} unit_auto=${FApp.unit_auto}`);

    var prec = element.attr('precision');
    if (typeof prec !== 'undefined') {
      prec = element.attr('prec');
    }
    // console.log(prec);
    prec = sanitizePrecision(prec);
    //console.log(FApp.id + ' precision=' + prec);
    FApp.precision = prec;
    FApp.formula_applet = domElem;

    element.click(ev => {
      if (FApp.hasResultField) {
        ev.stopPropagation(); //avoid body click
        $(".formula_applet").removeClass('selected');
        element.addClass('selected');
        $("button.keyb_button").removeClass('selected');
        if ($('#virtualKeyboard').css('display') == 'none') {
          element.nextAll("button.keyb_button:first").addClass('selected');
        }
        activeMathfieldIndex = FApp.index;
      } else {
        var mf_container = MQ.StaticMath(FAList[index].formula_applet);
        var mf_latex_for_parser = mf_container.latex();
        var myTree = new fa_tree();
        myTree.leaf.content = mf_latex_for_parser;
      }

      try {
        document.getElementById('output_1').innerHTML = elemeng.get().inner_ori + ' hasSolution=' + FApp.hasSolution;
      } catch {
        console.log(domElem.inner_ori + ' hasSolution=' + FApp.hasSolution);
      }
      try {
        document.getElementById('output_2').innerHTML = domElem.replaced + ' unit_auto=' + FApp.unit_auto;
        var replace_back = domElem.replaced;
        replace_back = replace_back.replace(/\\unit{/g, '\\textcolor{blue}{');
        replace_back = replace_back.replace(/\\MathQuillMathField{}/g, '?');
        editHandlerDebug(replace_back);
      } catch {
        console.log(domElem.replaced + ' unit_auto=' + FApp.unit_auto);
      }
    })
    FAList[index] = FApp;
    console.log("FAList", FAList, index);

    console.log('isEditor=' + isEditor);
    if (isEditor) {
      // *** editor ***
      //console.log('init editor');
      prepend(function () {
        // initTranslation()
      });
      // make whole mathFieldSpan editable
      var mathFieldSpan = document.getElementById('math-field');
      editor_mf = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true, // configurable
        handlers: {
          edit: function () { // useful event handlers
            show_editor_results(editor_edithandler(editor_mf.latex()));
          }
        }
      });
      FApp.mathField = editor_mf;

      var mqEditableField = $('#editor').find('.mq-editable-field')[0];
      // adjust events
      $('#set-input-d, #set-input-e').on('mousedown', ev => {
        ev.preventDefault();
        set_input();
      });
      $('#set-unit-d').on('mousedown', ev => {
        ev.preventDefault();
        set_unit();
      });
      $('#set-unit-e, #set-unit-e').on('mousedown', ev => {
        ev.preventDefault();
        set_unit();
      });
      $('#erase-unit-d, #erase-unit-e').on('mousedown', ev => {
        ev.preventDefault();
        erase_unit();
      });
      $('#random-id-d, #random-id-e').on('mousedown', ev => {
        ev.preventDefault();
        //console.log('random-id');
        var r_id = makeid(8);
        // console.log(r_id);
        document.getElementById('fa_name').value = r_id;
        new_fa_id = r_id;
        show_editor_results(editor_edithandler(editor_mf.latex()));
      });

      $('#fa_name').on('input', ev => {
        var fa_name = ev.target.value;
        //console.log('fa_name=' + fa_name);
        // avoid XSS
        fa_name = fa_name.replace(/</g, '');
        fa_name = fa_name.replace(/>/g, '');
        fa_name = fa_name.replace(/"/g, '');
        fa_name = fa_name.replace(/'/g, '');
        fa_name = fa_name.replace(/&/g, '');
        fa_name = fa_name.replace(/ /g, '_');
        // console.log(fa_name);
        if (4 <= fa_name.length && fa_name.length <= 20) {
          new_fa_id = fa_name;
          show_editor_results(editor_edithandler(editor_mf.latex()));
        }
      });

      $('input[type="radio"]').on('click', ev => {
        result_mode = ev.target.id;
        if (result_mode == 'auto') {
          $('span.mq-class.inputfield').prop('contentEditable', 'false');
          show_editor_results(editor_edithandler(editor_mf.latex()));
        }
        if (result_mode == 'manu') {
          $('span.mq-class.inputfield').prop('contentEditable', 'true');
          show_editor_results(editor_edithandler(editor_mf.latex()));
        }
        //console.log(result_mode);
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
      console.log('after mathquillifying:');
      console.log(domElem);
      if (FApp.hasResultField) {
        if (element.attr('data-b64') !== undefined) {
          FApp.hasSolution = true;
          var zip = element.attr('data-b64');
          FAList[index].solution = decode(zip);
        } else {
          FApp.hasSolution = false;
        };
        console.log('formula_applet=');
        console.log(domElem);
        var mqEditableField = element.find('.mq-editable-field')[0];
        console.log('mqEditableField=');
        console.log(mqEditableField);
        var mf = MQ.MathField(mqEditableField, {});
        console.log('mf=');
        console.log(mf);
        mf.config({
          handlers: {
            edit: () => {
              mqEditableField.focus();
              // console.log('edit ' + index);
              editHandler(index);
            },
            enter: () => {
              editHandler(index);
            },
          }
        });
        FApp.mathField = mf;
      }
    }
    if (FApp.hasResultField) {
      FApp.mqEditableField = mqEditableField;
      FApp.hammer = new Hammer(mqEditableField);
      FApp.hammer.on("doubletap", function (ev) {
        //console.log(index + ' ' + ev.type);
        virtualKeyboard_show();
      });
      FApp.hammer.on("press", function (ev) {
        //console.log(index + ' ' + ev.type);
      });
    }
    index ++;
  });
}

function unify_definitionsets(def) {
  // console.log(def);
  def = def.replace(/\s/g, "");
  def = def.replace(/\&&/g, "&");
  // console.log(def);
  var ds_list = def.split("&");
  for (var i = 0; i < ds_list.length; i++) {
    var ds = ds_list[i];
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
    // console.log(i + ' ' + result);
    ds_list[i] = result;
    // console.log(ds_list[i]);
  }
  return ds_list;
}

function get_selection(mf, eraseClass) {
  // typof mf = mathField
  // console.log(mf);
  var ori = mf.latex();
  // console.log('ori=' + ori);
  var erased = ori;
  if (eraseClass) {
    erased = erase_class(ori);
  }
  // console.log(erased);
  var replacement = createReplacement(ori);
  if (ori.indexOf(replacement) == -1) {
    // replacement has to be done before erase of class{...
    // Do replacement!
    mf.typedText(replacement);
    // erase class{inputfield}
    var replaced_and_erased = mf.latex();
    if (eraseClass) {
      replaced_and_erased = erase_class(replaced_and_erased);
    }
    var pre_selected = '?';
    var selected = '?';
    var post_selected = '?';
    var pos = replaced_and_erased.indexOf(replacement);
    pre_selected = replaced_and_erased.substring(0, pos);
    // selected = replacement
    post_selected = replaced_and_erased.substring(pos + replacement.length);
    // Delete pre_selected from beginning of erased
    // and delete post_selected from end of erased
    var check = erased.substr(0, pre_selected.length);
    if (check !== pre_selected) {
      console.log('Something went wrong with replacement of input field');
    }
    erased = erased.substring(pre_selected.length);
    check = erased.substring(erased.length - post_selected.length);
    if (check !== post_selected) {
      console.log('Something went wrong with replacement of input field');
    }
    selected = erased.substring(0, erased.length - post_selected.length);
    // console.log('selected=' + selected);
    // console.log('selected.length=' + selected.length);
    return [pre_selected, selected, post_selected, ori];
  }
}

function set_input() {
  //console.log('set_input');
  var temp = get_selection(editor_mf, true);
  //console.log(temp);
  var pre_selected = temp[0];
  var selected = temp[1];
  var post_selected = temp[2];
  var ori = temp[3];
  if (selected.length > 0) {
    var new_latex = pre_selected + '\\class{inputfield}{' + selected + '}' + post_selected;
    // console.log(new_latex);
    editor_mf.latex(new_latex);
  } else {
    ori = ori.replace('class{', '\\class{inputfield}{');
    // console.log(ori);
    editor_mf.latex(ori);
  }
}

function get_position_of_unittags(latex, unit_tag) {
  // get position of exising unit tags
  var pos = 0;
  var start_of_unittags = [];
  var end_of_unittags = [];
  do {
    pos = latex.indexOf(unit_tag, pos);
    if (pos >= 0) {
      //  console.log(pos);
      var rest = latex.substr(pos + unit_tag.length - 1);
      //  console.log(rest);
      var bracket = find_corresponding_right_bracket(rest, '{');
      var pos_right_bracket = pos + unit_tag.length + bracket.right_pos;
      start_of_unittags.push(pos);
      end_of_unittags.push(pos_right_bracket);
      //pos_right_bracket points to char right of the right bracket
      //  console.log(latex.substr(pos, unit_tag.length + bracket.right_pos)); // should log \textcolor{blue}{...}
      pos++;
    }
  } while (pos >= 0)
  return {
    sof_unittags: start_of_unittags,
    eof_unittags: end_of_unittags
  };
}

function set_unit() {
  var unit_tag = '\\textcolor{blue}{';
  // console.log('activeMathfieldIndex=' + activeMathfieldIndex);
  var mf = FAList[activeMathfieldIndex].mathField;
  // erase class inputfield = false
  var temp = get_selection(mf, false);
  var pre_selected = temp[0];
  var selected = temp[1];
  var post_selected = temp[2];
  var ori = temp[3];

  var start = pre_selected.length;
  var end = start + selected.length;
  // console.log(ori);
  // console.log('selection from ' + start + ' to ' + end);
  var selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var k = start; k < end; k++) {
    selectpattern[k] = 's';
  }

  var posn = get_position_of_unittags(ori, unit_tag);
  var start_of_unittags = posn.sof_unittags;
  var end_of_unittags = posn.eof_unittags;
  var pattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var i = 0; i < start_of_unittags.length; i++) {
    // console.log(start_of_unittags[i] + '->' + end_of_unittags[i]);
    for (var k = start_of_unittags[i]; k < end_of_unittags[i]; k++) {
      pattern[k] = '#';
    }
  }
  // console.log(selectpattern.join('')); // join: transform from array to string
  //  console.log(pattern.join('')); // join: transform from array to string
  // inspect selection start
  for (var i = 0; i < start_of_unittags.length; i++) {
    if (start_of_unittags[i] < start && start <= end_of_unittags[i]) {
      // move start leftwards
      start = start_of_unittags[i];
      // short circuit:
      i = start_of_unittags.length;
    }
  }
  // inspect selection end
  for (var i = 0; i < start_of_unittags.length; i++) {
    if (start_of_unittags[i] <= end && end <= end_of_unittags[i]) {
      // move end rightwards
      end = end_of_unittags[i];
      // short circuit:
      i = start_of_unittags.length;
    }
  }
  // debug
  var selectpattern = '.'.repeat(ori.length).split(''); // split: transform from string to array
  for (var k = start; k < end; k++) {
    selectpattern[k] = 's';
  }
  // console.log(selectpattern.join('')); // join: transform from array to string

  // delete unittags inside selection
  var ori_array = ori.split('');
  for (var i = 0; i < start_of_unittags.length; i++) {
    if (start <= start_of_unittags[i] && end_of_unittags[i] <= end) {
      for (var k = start_of_unittags[i]; k < start_of_unittags[i] + unit_tag.length; k++) {
        ori_array[k] = '§';
      }
      ori_array[end_of_unittags[i] - 1] = '§';
    }
  }
  // console.log(ori);
  ori = ori_array.join('');
  // console.log(ori); // join: transform from array to string

  if (selected.length > 0) {
    // new calculation necessary
    pre_selected = ori.substring(0, start);
    selected = ori.substring(start, end);
    post_selected = ori.substring(end);
    var new_latex = pre_selected + unit_tag + selected + '}' + post_selected;
    // new_latex = new_latex.replace(/\xA7/g, '');
    new_latex = new_latex.replace(/§/g, '');
    new_latex = new_latex.replace('class{', '\\class{inputfield}{');
    // console.log(new_latex);
    mf.latex(new_latex);
  } else {
    ori = ori.replace('class{', '\\class{inputfield}{');
    // console.log(ori);
    mf.latex(ori);
  }
}

function erase_unit() {
  var unit_tag = '\\textcolor{blue}{';
  // console.log('erase-unit');
  // console.log('activeMathfieldIndex=' + activeMathfieldIndex);
  var mf = FAList[activeMathfieldIndex].mathField;
  var temp = get_selection(mf, false);
  // console.log(temp[0] + '::' + temp[1] + '::' + temp[2]);
  var ori = temp[3];
  // get position of unittags
  var posn = get_position_of_unittags(ori, unit_tag);
  var start_of_unittags = posn.sof_unittags;
  var end_of_unittags = posn.eof_unittags;

  // delete unittag outside cursor (or left boundary of selection)
  var cursorpos = temp[0].length;
  var ori_array = ori.split('');
  for (var i = 0; i < start_of_unittags.length; i++) {
    if (start_of_unittags[i] <= cursorpos && cursorpos <= end_of_unittags[i]) {
      for (var k = start_of_unittags[i]; k < start_of_unittags[i] + unit_tag.length; k++) {
        ori_array[k] = '§';
      }
      ori_array[end_of_unittags[i] - 1] = '§';
    }
  }
  // console.log(ori);
  ori = ori_array.join('');
  // console.log(ori); // join: transform from array to string
  ori = ori.replace(/§/g, '');
  ori = ori.replace('class{', '\\class{inputfield}{');
  // restore selection-checked mf
  mf.latex(ori);
}

function separate_class(latex, class_tag) {
  var before_tag = '';
  var tag = '';
  var after_tag = '';
  var pos = latex.indexOf(class_tag); //)
  if (pos > -1) {
    before_tag = latex.substring(0, pos);
    var rest = latex.substring(pos + class_tag.length - 1);
    // rest starts with {
    var bracket = find_corresponding_right_bracket(rest, '{');
    // bracket = [left_pos, bra.length, right_pos, rightbra.length]
    if (bracket.left_pos !== 0 || bracket.bra_length !== 1 || bracket.rightbra_length !== 1) {
      console.log('Something went wront at separate_class()');
    }
    tag = rest.substring(1, bracket.right_pos);
    after_tag = rest.substring(bracket.right_pos + 1);
  } else {
    before_tag = '';
    tag = '';
    after_tag = latex;
  }
  // console.log([before_tag, tag, after_tag]);
  return [before_tag, tag, after_tag];
}

function editor_edithandler(latex) {
  $('#output-code-0').text(latex);
  return separate_class(latex, 'class{');
}

function erase_class(latex) {
  // latex = 'abc+class{def}+ghi';
  // temp = ['abc+', 'def', '+ghi'];
  var temp = editor_edithandler(latex);
  return temp[0] + temp[1] + temp[2];
}

function show_editor_results(parts) {
  var result = '<p class="formula_applet"';
  // console.log(new_fa_id);
  var common_result = ' id="' + new_fa_id;
  if (result_mode == 'manu') {
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
  $('#output-code-3').text(wikiresult);
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