// This is prepare_page.js

var prepare_page_exists = true;
var default_precision = 0.000001;
var activeMathfieldIndex = 0;
var MQ = '';
var FAList = [];
var new_fa_id = 'x8rT3dkkS';
var result_mode = '';
class FA {
  constructor() {
    this.index = '';
    this.id = '';
    this.formula_applet = '';
    this.hasSolution = '';
    this.solution = '';
    this.mqEditableField = '';
    this.mathField = '';
    this.hammer = '';
    this.definitionset_list = [];
    this.precision = default_precision;
    this.hasResultField = true;
  }
}

// function initTranslation(){
//   $('input.language').on('change', function (ev) {
//     console.log(ev);
//     // obtain lang = (id of .language button)
//     var lang = $(this).attr('id'); // obtain language id
//     if(lang == ''){
//       lang = 'de';
//     }
//     switchTo(lang);
//   });
//  }

// prepare_page() is called by glue.js
function prepare_page() {
  // dirty hack
  if (typeof (isWiki) === 'undefined') {
    isWiki = true;
  }
  console.log('isWiki=' + isWiki);
  // waits for MathQuill to load
  $("img.mod").remove();
  ($('<button class="keyb_button">\u2328</button>')).insertAfter($(".formula_applet"));
  $('button.keyb_button').on('mousedown', function (ev) {
    vkbd_show();
    $("button.keyb_button").removeClass('selected');
  });
  ($('<img class="mod">')).insertAfter($(".formula_applet"));
  $(document).ready(function () {
    mathQuillify();
    // initTranslation();
  })

  $('body').on('keyup', function (ev) {
    var key = ev.originalEvent.key;
    // console.log(ev);
    // console.log(kev.key, kev.metaKey, kev.ctrlKey);
    if (key == 'Tab') {
      var fa = $(ev.target).parents('.formula_applet');
      var id = $(fa).attr('id');
      console.log(id);
      // for (var i = 0; i < FAList.length; i++){
      //   var fapp = FAList[i];
      //   fapp.formula_applet.click();
      // }
      fa.click();
    }
  });
  // testcreateReplacement();
}

// function isAndr() cannot be moved to glue.js because
// glue.js is executed but not stored at test.mathebuch-online.de/wiki
function isAndr() {
  return (navigator.userAgent.toUpperCase().indexOf('ANDROID') !== -1);
}

function keyboardEvent(cmd) {
  console.log('prepare_page activeMathfieldIndex=' + activeMathfieldIndex);
  var FApp = FAList[activeMathfieldIndex];
  var mf = FApp.mathField;
  // var fa = FApp.formula_applet;
  // var mqEditableField = FApp.mqEditableField;

  if (typeof mf !== 'undefined') {
    console.log(cmd);
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
      // $(mqEditableField).click();
      // mf.typedText(' ');
      // mqEditableField.focus();
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
  console.log(a + ' ?=? ' + b);
  var equ = a + '=' + b;
  check_if_equality(id, equ, ds_list);
}

function check_if_equality(id, equ, ds_list) {
  var myTree = parse(equ);
  myTree = fillWithRandomValAndCheckDefSets(myTree, ds_list);
  var almostOne = evaluateTree(myTree);
  var dif = Math.abs(almostOne - 1);
  console.log('dif=' + dif);
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
  var temp = '';
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
      var tree2 = tree();
      tree2 = JSON.parse(rememberTree);
      console.log('restore');
      fillWithValues(tree2);
      var variable_value_list = tree2.variable_value_list;
      console.log('fill');
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
    console.log('numberOfTries=' + numberOfTries);
    if (success == true) {
      console.log('filled with success. Time= ' + timePassed);
    } else {
      tree2.hasValue = false;
      tree2.variable_value_list = [];
    }
    return tree2;
  }
}

function editHandler(index) {
  var fa = $(".formula_applet")[index];
  var mf = FAList[index].mathField;
  var mf_container = MQ.StaticMath(FAList[index].formula_applet);
  var solution = FAList[index].solution;
  var hasSolution = FAList[index].hasSolution;
  var id = FAList[index].id; // name of formula_applet
  var ds_list = FAList[index].definitionset_list;
  if (hasSolution) {
    check_if_equal(id, mf.latex(), solution, ds_list);
  } else {
    check_if_equality(id, mf_container.latex(), ds_list);
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

function mathQuillify() {
  MQ = MathQuill.getInterface(2);
  vkbd_init();
  $(".formula_applet").each(function () {
    var temp = (this.innerHTML);
    this.innerHTML = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
  });
  $(".formula_applet").each(function () {
    var temp = (this.innerHTML);
    // console.log('temp=' + temp);
    this.innerHTML = temp.replace(/\\unit{/g, '\\textcolor{blue}{');
    // console.log('replaced=' + this.innerHTML);
  });
  $(".formula_applet").each(function () {
    var FApp = new FA();
    FApp.hasResultField = (this.innerHTML.indexOf('\\MathQuillMathField{}') >= 0);
    var index = $(".formula_applet").index(this);
    FApp.index = index;
    FApp.id = $(this).attr('id') // name of formula_applet
    var isEditor = (FApp.id.toLowerCase() == 'editor');
    if (isEditor) {
      FApp.hasResultField = true;
    }
    // console.log('§§§ ' + this.innerHTML + ' ' + FApp.hasResultField);
    var def = $(this).attr('def');
    if (typeof def !== 'undefined') {
      FApp.definitionset_list = unify_definitionsets(def);
    }
    var prec = $(this).attr('precision');
    if (typeof prec !== 'undefined') {
      prec = $(this).attr('prec');
    }
    // console.log(prec);
    prec = sanitizePrecision(prec);
    // console.log(FApp.id + ' precision=' + prec + ' ' + 0.5 * prec);
    FApp.precision = prec;
    FApp.formula_applet = this;
    if (FApp.hasResultField) {
      $(this).click(function () {
        $(".formula_applet").removeClass('selected');
        $(this).addClass('selected');
        $("button.keyb_button").removeClass('selected');
        if ($('#vkbd').css('display') == 'none') {
          $(this).nextAll("button.keyb_button:first").addClass('selected');
        }
        activeMathfieldIndex = FApp.index;
      });
    }
    FAList[index] = FApp;

    if (isEditor) {
      // *** editor ***
      console.log('init editor');
      prepend(function () {
        initTranslation()
      });
      // make whole mathFieldSpan editable
      var mathFieldSpan = document.getElementById('math-field');
      MQ = MathQuill.getInterface(2);
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
      $('#set-input-d, #set-input-e').on('mousedown', function (ev) {
        ev.preventDefault();
        set_input();
      });
      $('#set-unit-d').on('mousedown', function (ev) {
        ev.preventDefault();
        set_unit();
      });
      $('#set-unit-e, #set-unit-e').on('mousedown', function (ev) {
        ev.preventDefault();
        set_unit();
      });
      $('#erase-unit-d, #erase-unit-e').on('mousedown', function (ev) {
        ev.preventDefault();
        erase_unit();
      });
      $('#random-id-d, #random-id-e').on('mousedown', function (ev) {
        ev.preventDefault();
        console.log('random-id');
        var r_id = makeid(8);
        // console.log(r_id);
        document.getElementById('fa_name').value = r_id;
        new_fa_id = r_id;
        show_editor_results(editor_edithandler(editor_mf.latex()));
      });

      $('#fa_name').on('input', function (ev) {
        var fa_name = ev.target.value;
        console.log('fa_name=' + fa_name);
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

      $('input[type="radio"]').on('click', function (ev) {
        result_mode = ev.target.id;
        if (result_mode == 'auto') {
          $('span.mq-class.inputfield').prop('contentEditable', 'false');
          show_editor_results(editor_edithandler(editor_mf.latex()));
        }
        if (result_mode == 'manu') {
          $('span.mq-class.inputfield').prop('contentEditable', 'true');
          show_editor_results(editor_edithandler(editor_mf.latex()));
        }
        console.log(result_mode);
      });
      $('#random-id-d').mousedown();
      $('input[type="radio"]#manu').click();
    } else {
      //******************
      // *** no editor ***
      MQ.StaticMath(this);
      if (FApp.hasResultField) {
        if ($(this).attr('data-b64') !== undefined) {
          FApp.hasSolution = true;
          var zip = $(this).attr('data-b64');
          FAList[index].solution = decode(zip);
        } else {
          FApp.hasSolution = false;
        };
        // console.log('formula_applet=');
        // console.log(this);
        var mqEditableField = $(this).find('.mq-editable-field')[0];
        // console.log('mqEditableField=' + mqEditableField);
        var mf = MQ.MathField(mqEditableField, {});
        // console.log('mf=' + mf);
        mf.config({
          handlers: {
            edit: function () {
              mqEditableField.focus();
              // console.log('edit ' + index);
              editHandler(index);
            },
            enter: function () {
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
        console.log(index + ' ' + ev.type);
        vkbd_show();
      });
      FApp.hammer.on("press", function (ev) {
        console.log(index + ' ' + ev.type);
      });
    }
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
  // typeOf mf = mathField
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
  console.log('set_input');
  var temp = get_selection(editor_mf, true);
  console.log(temp);
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
      var temp = find_corresponding_right_bracket(rest, '{');
      var pos_right_bracket = pos + unit_tag.length + temp[2];
      start_of_unittags.push(pos);
      end_of_unittags.push(pos_right_bracket);
      //pos_right_bracket points to char right of the right bracket
      //  console.log(latex.substr(pos, unit_tag.length + temp[2])); // should log \textcolor{blue}{...}
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
    var temp = find_corresponding_right_bracket(rest, '{');
    // temp = [left_pos, bra.length, right_pos, rightbra.length]
    if (temp[0] !== 0 || temp[1] !== 1 || temp[3] !== 1) {
      console.log('Something went wront at separate_class()');
    }
    tag = rest.substring(1, temp[2]);
    after_tag = rest.substring(temp[2] + 1);
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
  var wikiresult = '<f_app';
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
  wikiresult += common_result + '</f_app>';

  $('#output-code-1').text(parts[1]);
  $('#output-code-2').text(result);
  $('#output-code-3').text(wikiresult);
  var out = $('textarea#wiki-text');
  if (out.length > 0) {
    // var iw = 'isWiki='+isWiki +  String.fromCharCode(13, 10);
    // out.text(iw + wikiresult + String.fromCharCode(13, 10) + String.fromCharCode(13, 10) + result);
    var isw = get_isWiki_from_URL();
    // console.log('isw=' + isw);
    if (isWiki || isw) {
      out.text(wikiresult);
    } else {
      out.text(result);
    }
  }
}

function get_isWiki_from_URL(){
    var url = new URL(document.location.href);
    // console.log(url);
    var iw = url.searchParams.get('isWiki');
    if(iw == 'true'){
      return true;
    } else{
      return false;
    }
}

function prepend(after_prepend) {
  var before = $('div#ed_before');
  // console.log('before.length=' + before.length);
  if (before.length == 0) {
    var ed = $('.formula_applet#editor');
    ed.before('<p id="mode_select">');
    $('p#mode_select').append('  <h3><span class="mw-headline" id="Mode">Mode</span></h3>');
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
    // ed.after('<p id="output-code-3"></p>');
    ed.after('<hr /><textarea id="wiki-text" rows=4 cols=150></textarea>');
    var unitbuttons = '<button type="button" class="tr de peri problemeditor" id="set-unit-d">Einheit</button>';
    unitbuttons += '<button type="button" class="tr en peri problemeditor" id="set-unit-e">Unit</button>';
    unitbuttons += '<button type="button" class="tr de erau problemeditor" id="erase-unit-d">Einheit l&ouml;schen</button>';
    unitbuttons += '<button type="button" class="tr en erau problemeditor" id="erase-unit-e">Erase Unit</button>';
    ed.after(unitbuttons);
    ed.after('<button type="button" class="tr de sif problemeditor" id="set-input-d">Eingabe-Feld setzen</button><button type="button" class="tr en sif problemeditor" id="set-input-e">Set input field</button>');
    var prepend_uses = $('.prepend_uses#p_u');
    if (isWiki) {
      license_link = 'https://github.com/gro58/FormulaApplet/blob/master/js/lib/ToDo.md';
    } else {
      license_link = 'license.php';
    }
    prepend_uses.after('<p><span class="tr de uses">Das Formel-Applet benutzt die Bibliotheken jQuery, MathQuill und Hammer. </span><span class="tr en uses">FormulaApplet uses jQuery, MathQuill, and Hammer. </span><a href="' + license_link + '" class="tr de moreinfo">Weitere Informationen...</a><a href="' + license_link + '" class="tr en moreinfo">More info...</a></p>');
  }
  after_prepend();
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

function testcreateReplacement() {
  console.log('replacement=' + createReplacement('test'));
  console.log('replacement=' + createReplacement('leider∀µ∉ö∋∐∔∝∤∮∱∸∺∽≀verloren'));
  console.log('replacement=' + createReplacement('b∀µ∉ö∋∐∝∤∮∱∸∺∽≀'));
  console.log('replacement=' + createReplacement('∀µ∉ö∋∐∔∝∤∮∱∸m∽≀'));
  console.log('replacement=' + createReplacement('∉∀µ ö∋∐∔∤∮∱∸∺∽≀knurr∝'));
  console.log('replacement=' + createReplacement('∀aµ∉öb∋∐∔∝c∤d∱∸∺∽≀'));
}