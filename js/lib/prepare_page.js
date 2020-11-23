// This is prepare_page.js

var prepare_page_exists = true;
var precision = 0.000001;
var activeMathfieldIndex = '';
var MQ = '';
var FAList = [];
var new_fa_id = 'x8rT3dkkS';
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
  }
}

function prepare_page() {
  // waits for MathQuill to load
  $("img.mod").remove();
  ($('<img class="mod">')).insertAfter($(".formula_applet"));
  // $( '#editor').on('mouseover', function(ev){
  //   // console.log('mouseover');
  //   console.log(document.activeElement);
  // });
  $(document).ready(function () {
    mathQuillify();
  })
}

function base64_zip_decode(code, decode_success) {
  var zip = new JSZip();
  zip.loadAsync(code, {
    base64: true
  }).then(function (data) {
    zip.file("content.txt").async("string").then(function (data) {
      decode_success(data);
    });
  });
}

// function isAndr() cannot be moved to glue.js because
// glue.js is executed but not stored at test.mathebuch-online.de/wiki

function isAndr() {
  return (navigator.userAgent.toUpperCase().indexOf('ANDROID') !== -1);
}


function keyboardEvent(cmd) { // was bridge(cmd)
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

function check_if_equal(id, a, b) {
  console.log(a + ' ?=? ' + b);
  var equ = a + '=' + b;
  check_if_equality(id, equ);
}

function check_if_equality(id, equ) {
  myTree = new tree();
  myTree.leaf.content = equ;
  parse(myTree);
  var almostOne = value(myTree);
  var dif = Math.abs(almostOne - 1);
  console.log('dif=' + dif);
  if (dif < precision) {
    $('#' + id).removeClass('mod_wrong').addClass('mod_ok');
  } else {
    $('#' + id).removeClass('mod_ok').addClass('mod_wrong');
  }
}

function editHandler(index) {
  var fa = $(".formula_applet")[index];
  // var index = $(".formula_applet").index($('#' + id));
  var mf = FAList[index].mathField;
  var mf_container = MQ.StaticMath(FAList[index].formula_applet);
  // console.log(fa);
  var solution = FAList[index].solution;
  var hasSolution = FAList[index].hasSolution;
  var id = FAList[index].id; // name of formula_applet

  // console.log(id + ' index=' + index + ' hasSolution=' + hasSolution + ' mode=' + entermode);
  if (hasSolution) {
    // out = mf.latex() + ' ' + solution;
    check_if_equal(id, mf.latex(), solution);
  } else {
    // out = mf_container.latex();
    check_if_equality(id, mf_container.latex());
  }
  // document.getElementById('output').innerHTML = out;
};

function storeSolution(sol, ind) {
  console.log(ind + ' solution: ' + sol);
  FAList[ind].solution = sol;
}

var editor_mf = '';

function mathQuillify() {
  MQ = MathQuill.getInterface(2);
  vkbd_init();
  $(".formula_applet").each(function () {
    var FApp = new FA();
    var index = $(".formula_applet").index(this);
    FApp.index = index;
    FApp.id = $(this).attr('id') // name of formula_applet
    var isEditor = (FApp.id.toLowerCase() == 'editor');
    // console.log('isEditor=' + isEditor);
    FApp.formula_applet = this;
    $(this).click(function () {
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
      // var id = $(this).attr('id');
      // activeMathfieldIndex = $(".formula_applet").index($('#' + id));
      activeMathfieldIndex = FApp.index;
      // console.log(activeMathfieldIndex);
    });
    FAList[index] = FApp;

    if (isEditor) {
      // *** editor ***
      // var eraseclass = '';

      console.log('init editor');
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
      // console.log(editor_mf);

      var mqEditableField = $('#editor').find('.mq-editable-field')[0];
      // console.log(mqEditableField);

      // show output-codes before first edit
      show_editor_results(editor_edithandler(editor_mf.latex()));
    } else {
      // *** no editor ***
      MQ.StaticMath(this);
      if ($(this).attr('data-zip') !== undefined) {
        FApp.hasSolution = true;
        var zip = $(this).attr('data-zip');
        // base64_zip_decode(zip, function (decoded) {
        //   // storeSolution(decoded, index);
        // });
      } else {
        FApp.hasSolution = false;
      };
      var mqEditableField = $(this).find('.mq-editable-field')[0];
      var mf = MQ.MathField(mqEditableField, {});
      mf.config({
        handlers: {
          edit: function () {
            mqEditableField.focus();
            // console.log('edit ' + index);
          },
          enter: function () {
            editHandler(index);
          }
        }
      });
      FApp.mathField = mf;
      // console.log(index);
      // console.log(FApp);
    }
    FApp.mqEditableField = mqEditableField;
    FApp.hammer = new Hammer(mqEditableField);
    FApp.hammer.on("doubletap", function (ev) {
      console.log(index + ' ' + ev.type);
      vkbd_show();
    });
    FApp.hammer.on("press", function (ev) {
      console.log(index + ' ' + ev.type);
      vkbd_show();
    });
  });
}

function editor_edithandler(latex) {
  $('#output-code-0').text(latex);
  var part1 = '?';
  var part2 = '?';
  var part3 = '?';
  var pos = latex.indexOf('class{');
  if (pos > -1) {
    part1 = latex.substring(0, pos);
    var rest = latex.substring(pos + 5);
    var temp = find_corresponding_right_bracket(rest, '{');
    if (temp[0] !== 0 || temp[1] !== 1 || temp[3] !== 1) {
      console.log('Something went wront at problemeditor.js');
    }
    part2 = rest.substring(1, temp[2]);
    part3 = rest.substring(temp[2] + 1);
  }
  // console.log([part1, part2, part3]);
  return [part1, part2, part3];
}

function erase_class( latex){
  var temp = editor_edithandler(latex);
  return temp[0] + temp[1] +temp[2];
}

function show_editor_results(parts) {
  // console.log(parts);
  var zip = new JSZip();
  zip.file("content.txt", parts[1]);
  zip.generateAsync({
    type: "base64"
  }).then(function (zipcontent) {
    // TODO inputfield for id of result
    var result = '<p class="formula_applet" id="' + new_fa_id + '" data-zip="';
    result += zipcontent;
    result += '">';
    result += parts[0];
    result += '\\MathQuillMathField{}';
    result += parts[2];
    result += '</p>';
    var wikiresult = '<f_app id=' + new_fa_id + ' data-zip="';
    wikiresult += zipcontent;
    wikiresult += '">';
    wikiresult += parts[0];
    wikiresult += '{{result}}';
    wikiresult += parts[2];
    wikiresult += '</f_app>';

    $('#output-code-1').text(parts[1]);
    $('#output-code-2').text(result);
    $('#output-code-3').text(wikiresult);
  });
}