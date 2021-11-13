/**
 * FormulaAppletEditor widget module
 *
 * @param {H5P.jQuery} $
 */
H5PEditor.widgets.formulaAppletEditor = H5PEditor.FormulaAppletEditor = (function ($) {

  /**
   * Creates and edits a FormulaApplet.
   *
   * @class H5PEditor.FormulaAppletEditor
   * @param {Object} parent
   * @param {Object} field
   * @param {Object} params
   * @param {function} setValue
   */
  function FormulaAppletEditor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    this.changes = [];
    // console.log('FormulaApplet constructed:');
    // change the source code from within Chrome
  }

  /**
   * Append the field to the wrapper. 
   * @public
   * @param {H5P.jQuery} $wrapper
   */
  FormulaAppletEditor.prototype.appendTo = function ($wrapper) {
    var self = this;
    const id = ns.getNextFieldId(this.field);
    var params = self.parent.params;
    // console.log(params);
    if (params.id == 'new_id') {
      var new_id = makeid(12);
      console.log('new id -> ' + new_id);
      params.id = new_id;
    }
    params.TEX_expression = params.fa_applet;


    var html = '<p class="formula_applet edit" id="' + params.id + '"';
    if (params.formulaAppletPhysics == true) {
      html += ' mode="physics"';
    }
    if (params.formulaAppletMode == 'manu') {
      html += ' data-b64="' + params.data_b64 + '"';
    }
    html += '>';
    // html = '<p class="formula_applet edit" id="0815" >';

    var fieldMarkup = H5PEditor.createFieldMarkup(this.field, html, id);
    self.$item = H5PEditor.$(fieldMarkup);
    self.$formulaApplet = self.$item.find('.formula_applet');
    var temp = params.TEX_expression;
    // temp = temp.replace(/{{result}}/g, '\\MathQuillMathField{}');
    // temp = temp.replace(/{{result}}/g, '\\class{inputfield}{}');
    self.$formulaApplet.text(temp);
    self.$formulaApplet[0].innerHTML = '<span id="math-field">' + self.$formulaApplet[0].innerHTML + '</span>';


    self.config = {
      appendTo: self.$item[0],
      preferredFormat: 'hex',
      expression: self.getExpression(),
      change: function (expression) {
        self.setExpression(expression);
        console.log('change: ' + expression);
      },
      hide: function (expression) {
        // Need this to get expression if cancel is clicked
        self.setExpression(expression);
        console.log('hide: ' + expression);
      }
    };
    $wrapper.append(self.$item);

    var $button = H5P.JoubelUI.createButton({
      title: 'set_input_field',
      text: 'Set input field',
      click: function (event) {
        const si_ev = new Event('setInputEvent', {
          bubbles: true,
          cancelable: true,
          composed: false
        });
        si_ev.data = 4711;
        console.log('TRIGGER setInputEvent (formulaapplet-editor.js)');
        document.dispatchEvent(si_ev);
      }
    });
    // console.log('append Button');
    $wrapper.append($button);
    // append html-output
    $wrapper.append('<textarea id="html-output" rows="4" cols="150">output</textarea>');

    $(function () {
      //code that needs to be executed when DOM is ready, after manipulation
      afterAppend(self);
    });
  };

  /**
   * Hide expression selector
   * @method hide
   */
  FormulaAppletEditor.prototype.hide = function () {
    // this.$formulaApplet.spectrum('hide');
  };
  /**
   * Save the expression
   *
   * @param {Object} expression
   */
  FormulaAppletEditor.prototype.setExpression = function (expression) {
    // Save the value, allow null
    this.params = (expression === null ? null : expression);
    this.setValue(this.field, this.params);

    this.changes.forEach(function (cb) {
      cb(this.params);
    })
  };

  FormulaAppletEditor.prototype.getExpression = function () {
    var isEmpty = (this.params === null || this.params === "");
    return isEmpty ? null : this.params;
  };

  /**
   * Validate the current values.
   */
  FormulaAppletEditor.prototype.validate = function () {
    this.hide();
    return (this.params !== undefined && this.params.length !== 0);
  };

  FormulaAppletEditor.prototype.remove = function () {};

  return FormulaAppletEditor;
})(H5P.jQuery);

function afterAppend(obj) {
  waitForMain(function () {
    // console.log('window.mainIsLoaded ' + window.mainIsLoaded);
    if (window.mainIsLoaded == 1) {
      console.log('MAIN is loaded');
      window.mainIsLoaded = 2; // prevent from doing twice
      H5P.jQuery(document).trigger('resize');
      // console.log('TRIGGER preparePageEvent (formulaapplet-editor.js)');
      H5P.jQuery(document).trigger('preparePageEvent');
      // console.log('TRIGGER setInputEvent (formulaapplet-editor.js)');
      H5P.jQuery(document).trigger('setInputEvent');
    }
  });

  // setTimeout replaced by waitForMain
  // console.log('afterAppend wait 100ms then...');
  // setTimeout(function () {
  // H5P.jQuery(document).trigger('resize');
  // console.log('TRIGGER preparePageEvent (formulaapplet-editor.js)');
  // H5P.jQuery(document).trigger('preparePageEvent');
  // console.log('TRIGGER setInputEvent (formulaapplet-editor.js)');
  // H5P.jQuery(document).trigger('setInputEvent');
  // }, 100);
  // console.log(obj.parent.params);

  // if (obj.parent.params.id == 'new_id') {
  //   var new_id = makeid(12);
  //   console.log( 'new id = ' + new_id);
  //   obj.parent.params.id = new_id;
  // }

  var checkbox = document.getElementById(getSelectorID('field-formulaappletphysics'));
  // console.log(checkbox);
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      console.log("Physics Mode");
    } else {
      console.log("Math Mode");
    }
  });

  var texinput = H5P.jQuery('div.field.field-name-TEX_expression.text input')[0];
  texinput.addEventListener('input', updateTexinput);

  function updateTexinput(event) {
    console.log('TEX_expression changed: ' + event.target.value);
    var out = document.getElementById('html-output');
    console.log(out);
    out.value = event.target.value;
    console.log(out);
    obj.parent.params['fa_applet'] = event.target.value;
    // console.log(this);
    // console.log(self);
    // console.log(self.H5PEditor);
    // console.log(self.H5PEditor.Editor);
    // console.log(self.H5PEditor.FormulaAppletEditor);
    // console.log(self.H5PEditor.FormulaAppletEditor.setExpression('BliBlaNlu'));
    var mf = document.getElementById('math-field');
    console.log(mf);
    mf.innerHTML = event.target.value;
    H5P.jQuery(document).trigger('mathquillifyAllEvent');
  }

  var formulaAppletMode = document.getElementById(getSelectorID('field-formulaappletmode'));
  formulaAppletMode.addEventListener('change', function (e) {
    console.log('formulaAppletMode ' + this.name + ' ' + this.value);
  });
  // console.log('listening to formulaappletmode change event');

  H5P.jQuery('.field-name-id').css('display', 'none');


  // create 'set input field' button
  // var anchor = H5P.jQuery('div.field.field-name-fa_applet.text.formulaAppletEditor');
  // console.log(anchor);
  // var html = '<button type="button" class="problemeditor" id="set-input-e" style="">Set input field</button>'
  // H5P.jQuery(html).appendTo(anchor);



  // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
  document.addEventListener('setInputEvent', function (ev) {
    console.log(ev);
    // var d = ev.data;
    console.log('formulaapplet-editor.js: receive setInputEvent');
  });
  console.log('formulaapplet-editor.js: watch setInputEvent');


}

var try_counter = 0;
var try_counter_limit = 10;

function waitForMain(cont) {
  if (window.mainIsLoaded > 0) {
    cont();
  } else {
    try_counter++;
    console.log('Waiting for main: ' + try_counter);
    if (try_counter < try_counter_limit) {
      setTimeout(function () {
        waitForMain(cont);
      }, 300);
    } else {
      console.error('waitForMain: Timeout');
    }
  }
}

function makeid(length) {
  var result = 'fa';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-_.-_.-';
  var numOfChars = characters.length;
  for (var i = 2; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * numOfChars));
  }
  // console.log(result);
  // result = '"' + result + '"';
  return result;
}

function getSelectorID(selectorName) {
  var result = '';
  H5P.jQuery('select').each(function () {
    var haystack = (this.id).toLowerCase();
    var needle = selectorName.toLowerCase();
    if (haystack.startsWith(needle)) {
      result = this.id;
    }
  });
  if (result == '') {
    H5P.jQuery('input').each(function () {
      var haystack = (this.id).toLowerCase();
      var needle = selectorName.toLowerCase();
      if (haystack.startsWith(needle)) {
        result = this.id;
      }
    });
  }
  return result;
}