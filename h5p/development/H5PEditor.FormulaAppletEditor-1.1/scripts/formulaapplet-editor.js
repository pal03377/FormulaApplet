/**
 * FormulaAppletEditor widget module
 *
 * @param {H5P.jQuery} $
 */


var H5P = H5P || {};
console.log('Here is formulaapplet-editor.js 1.1 - window.name = ' + window.name);
console.log(H5P);
console.log(H5Pbridge);
//TODO get rid of global variables
var selectionArray = [];

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
    // params.TEX_expression = params.fa_applet;

    var hasSolution = (params.formulaAppletMode == 'manu');
    var html = '<p class="formula_applet edit" id="' + params.id + '"';
    if (params.formulaAppletPhysics == true) {
      html += ' mode="physics"';
    }
    if (hasSolution) {
      html += ' data-b64="' + params.data_b64 + '"';
    }
    var temp = params.TEX_expression;
    if (typeof temp == 'undefined') {
      temp = '17 + {{result}} = 21';
    }
    console.log('temp=' + temp);
    temp = temp.replace(/{{result}}/g, '\\class{inputfield}{}');
    console.log('temp=' + temp);
    html += '>';
    var span = '<span id="math-field">' + temp + '</span>';
    html += span;
    html += '<\p>';
    console.log('html=' + html);

    var fieldMarkup = H5PEditor.createFieldMarkup(this.field, html, id);
    self.$item = H5PEditor.$(fieldMarkup);
    self.$formulaApplet = self.$item.find('.formula_applet');

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

    self.config.change('formula applet changed');
    $wrapper.append(self.$item);

    var $button = H5P.JoubelUI.createButton({
      title: 'set_input_field',
      text: 'Set input field (Joubel)',
      click: function (event) {
        event.preventDefault();
        console.log("post setInputFieldEvent click");
        postEvent(["setInputFieldEvent", "dummy data"]);
      }
    });
    $button.attr('id', '#set-input-h5p');
    $wrapper.append($button);
    $button.on('mouseover', buttonMouseoverHandler);

    // var testhtml = '<p>' + params.test + '</p>';
    // $wrapper.append(testhtml);

    function buttonMouseoverHandler(ev) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      console.log("post setInputFieldMouseoverEvent");
      postEvent(["setInputFieldMouseoverEvent", 'dummy data']);
    };

    $(function () {
      //code that needs to be executed when DOM is ready, after manipulation
      var texinputparent = H5P.jQuery('div.field.field-name-TEX_expression.text input').parent();
      texinputparent.append('<br><br><textarea id="html-output" rows="4" cols="150">output</textarea>');
      afterAppend(self);
      waitForMainThenDo(afterMainIsLoaded);
    });
  };

  function afterMainIsLoaded() {
    // this code is executed if main is loaded
    console.log('*** MAIN is loaded *** ');
    console.log(H5Pbridge);
    console.log('before triggering preparePageEvent');
    H5Pbridge.preparePage();
    var id = getputId.get();
    console.log(id);
    if (id !== 'nothingToDo') {
      console.log('postEvent idChangedEvent with id=' + id);
      postEvent(["idChangedEvent", id]);
    }
    postEvent(["testEvent", "dummy data"]);
    var elem = document.getElementById('new_id');
    console.log(elem);
    H5P.jQuery(elem).attr('id', id)
    console.log(elem);
    postEvent(["refreshEvent", "dummy"]);
  }

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
  console.log('formulaapplet-editor.js: afterAppend - window.name = ' + window.name);

  // spread new id if necessary
  try {
    var idField = getField('id');
    console.log('idField.value=' + idField.value);
    if (idField.value == 'new_id') {
      var newId = H5Pbridge.makeid(12);
      console.log('new_id -> ' + newId);
      idField.value = idField.$input[0].value = newId;
      console.log('obj.parent.params.id=' + obj.parent.params.id);
      obj.parent.params.id = newId;
      console.log('obj.parent.params.id=' + obj.parent.params.id);
      // postEvent(["idChangedEvent", newId]); //wait for main to be loaded
      getputId.put(newId);
    } else {
      getputId.put('nothingToDo');
    }
  } catch (error) {
    console.error('ERROR: ' + error);
  }

  // // if (params.id == 'new_id') {
  //   var new_id = makeid(12);
  //   // console.log('new id -> ' + new_id);
  //   params.id = new_id;
  //   // }

  //TODO bug: new_id is not replaced by a random id when generatingon a new formula applet
  //TODO bug: getField('id') has a random id but gets a new random id

  window.addEventListener('message', setSolutionMessageHandler, false); //bubbling phase

  function setSolutionMessageHandler(event) {
    if (event.data[0] == 'setSolutionEvent') {
      console.log('RECEIVE message setSolutionEvent');
      var b64 = event.data[1];
      var data_b64 = getField('data_b64');
      data_b64.value = data_b64.$input[0].value = b64;
    }
  }

  function getField(name) {
    var children = obj.parent.children;
    var result;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.field.name == name) {
        result = child;
        i = children.length; //short circuit
      }
    }
    return result;
  }

  console.log('obj.parent.params');
  console.log(obj.parent.params);
  console.log('obj.parent.params.TEX_expression=' + obj.parent.params.TEX_expression);

  // teximput is updated by editor.js: showEditorResults
  var texinput = H5P.jQuery('div.field.field-name-TEX_expression.text input')[0];
  texinput.addEventListener('input', updateTexinputEventHandler);

  function updateTexinputEventHandler(event) {
    obj.parent.params['TEX_expression'] = event.target.value;
    var msg;
    if (event.isTrusted) {
      msg = ' event caused by keyboard input';
      event.preventDefault();
    } else {
      msg = ' event caused by input to FormulaApplet';
      console.log(obj);
      //event caused by JavaScript, especially input to FormulaApplet: let event be captured
    }
    console.log('TEX_expression changed: ' + event.target.value + msg);
    //TODO update formulaAppletEditor widget
    // cannot update formulaAppletEditor widget , because editorMf and editorMf.latex() is not available
  }

  var checkbox = document.getElementById(getSelectorID('field-formulaappletphysics'));
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      console.log("Physics Mode");
    } else {
      console.log("Math Mode");
    }
  });

  var formulaAppletMode = document.getElementById(getSelectorID('field-formulaappletmode'));
  formulaAppletMode.addEventListener('change', function (e) {
    // mode=auto means hasSolution=false  mode=manu means hasSolution=true
    console.log('post setModeEvent ' + this.value);
    postEvent(['setModeEvent', this.value]);
  });

  // hide field-name-id
  H5P.jQuery('.field-name-id').css('display', 'none');
  // hide field-name-data_b64
  H5P.jQuery('.field-name-data_b64').css('display', 'none');
}

function postEvent(message) {
  // message may be an array of [messageType, data]
  window.parent.parent.postMessage(message, window.parent.parent.document.URL);
}

// Start of waitForMain mechanism
// event listener listens to echoes from main.js
// var mainIsLoaded = 0; //TODO get rid of global var
// window.parent.parent.addEventListener('message', handleEchoMessage, true); //capturing phase

// function handleEchoMessage(event) {
//   if (event.data == 'echoFromMainEvent') {
//     mainIsLoaded += 1;
//     console.info('RECEIVE message echoFromMainEvent (formulaapplet-editor.js) mainIsLoaded=' + mainIsLoaded);
//   }
// }

//TODO get rid of global var
var try_counter = 0;
var try_counter_limit = 10;

function waitForMainThenDo(cont) {
  var mainIsLoaded = false;
  try {
    mainIsLoaded = H5Pbridge.mainIsLoaded();
  } catch (error) {
    console.log(try_counter);
    console.log(H5Pbridge);
  }
  if (mainIsLoaded) {
    // execute callback
    cont();
  } else {
    try_counter++;
    // postEvent("SignalToMainEvent");
    // // send another echo to main.js. If echo comes back, mainIsLoaded = true
    // console.info('(1) post message SignalToMainEvent (formulaapplet-editor.js) try=' + try_counter);
    console.info(`waitFarMain try_counter=${try_counter}`);
    if (try_counter < try_counter_limit) {
      setTimeout(function () {
        // recurse
        waitForMainThenDo(cont);
      }, 300);
    } else {
      console.error('waitForMainThenDo: Timeout');
      // optimistic approach
      afterMainIsLoaded();
    }
  }
}
// End of waitForMain mechanism


// function makeid(length) {
//   var result = 'fa';
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var numOfChars = characters.length;
//   for (var i = 2; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * numOfChars));
//   }
//   return result;
// }

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

//TODO get rid of global vars
const getputId = {
  idStore: '',
  get: function () {
    return idStore;
  },
  put: function (id) {
    idStore = id
  }
};