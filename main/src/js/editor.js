// editor.js
"use strict";
console.log('editor.js');

function prepend(after_prepend) {
    var before = $('div#ed_before');
    // console.log('before.length=' + before.length);
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
      // ed.after('<p id="output-code-3"></p>');
      ed.after('<hr /><textarea id="wiki-text" rows=4 cols=150></textarea>');
      var unitbuttons = '<button type="button" class="tr de peri problemeditor" id="set-unit-d">Einheit</button>';
      unitbuttons += '<button type="button" class="tr en peri problemeditor" id="set-unit-e">Unit</button>';
      unitbuttons += '<button type="button" class="tr de erau problemeditor" id="erase-unit-d">Einheit l&ouml;schen</button>';
      unitbuttons += '<button type="button" class="tr en erau problemeditor" id="erase-unit-e">Erase Unit</button>';
      ed.after(unitbuttons);
      ed.after('<button type="button" class="tr de sif problemeditor" id="set-input-d">Eingabe-Feld setzen</button><button type="button" class="tr en sif problemeditor" id="set-input-e">Set input field</button>');
      var prepend_uses = $('.prepend_uses#p_u');
      var license_link;
      if (isWiki) {
        license_link = 'https://github.com/gro58/FormulaApplet/blob/master/js/lib/ToDo.md';
      } else {
        license_link = 'license.php';
      }
      prepend_uses.after('<p><span class="tr de uses">Das Formel-Applet benutzt die Bibliotheken jQuery, MathQuill und Hammer. </span><span class="tr en uses">FormulaApplet uses jQuery, MathQuill, and Hammer. </span><a href="' + license_link + '" class="tr de moreinfo">Weitere Informationen...</a><a href="' + license_link + '" class="tr en moreinfo">More info...</a></p>');
    }
    after_prepend();
  }
  