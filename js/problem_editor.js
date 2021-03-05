// This is prepare_page.js

var prepare_page_exists = true;
var default_precision = 0.000001;
var activeMathfieldIndex = 0;
var MQ = '';
var FAList = [];
var new_fa_id = 'x8rT3dkkS';
var result_mode = '';
var editHandlerActive = true;
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
    this.unit_auto = false;
  }
}

function keyboardEvent(cmd) {
  //console.log('prepare_page activeMathfieldIndex=' + activeMathfieldIndex);
  var FApp = FAList[activeMathfieldIndex];
  var mf = FApp.mathField;
  // var fa = FApp.formula_applet;
  // var mqEditableField = FApp.mqEditableField;

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



var editor_mf = '';

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
    FApp.id = $(this).attr('id') // name of formula_applet
    var isEditor = (FApp.id.toLowerCase() == 'editor');
    if (isEditor) {
      FApp.hasResultField = true;
    }

    if (isEditor) {
      // *** editor ***
      //console.log('init editor');
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
        //console.log('random-id');
        var r_id = makeid(8);
        // console.log(r_id);
        document.getElementById('fa_name').value = r_id;
        new_fa_id = r_id;
        show_editor_results(editor_edithandler(editor_mf.latex()));
      });

      $('#fa_name').on('input', function (ev) {
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
        //console.log(result_mode);
      });
      $('#random-id-d').mousedown();
      $('input[type="radio"]#manu').click();
    } 
  });
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

function editor_edithandler(latex) {
  $('#output-code-0').text(latex);
  return separate_class(latex, 'class{');
}

function erase_class(latex) {
  var temp = editor_edithandler(latex);
  return temp[0] + temp[1] + temp[2];
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
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+-!%';
  var numOfChars = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * numOfChars));
  }
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