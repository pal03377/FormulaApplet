/**
 * FormulaAppletEditor widget module
 *
 * @param {H5P.jQuery} $
 */

var H5P = H5P || {};
console.log('Here is formulaapplet-editor.js');
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

    var fieldMarkup = H5PEditor.createFieldMarkup(this.field, html, id);
    self.$item = H5PEditor.$(fieldMarkup);
    self.$formulaApplet = self.$item.find('.formula_applet');
    var temp = params.TEX_expression;
    temp = temp.replace(/{{result}}/g, '\\class{inputfield}{}');
    var span = '<span id="math-field">' + temp + '</span>';
    // console.log('span=' + span);
    self.$formulaApplet[0].innerHTML = span;


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

    // console.log(self);
    self.config.change('75 + {{result}} = 77');
    // console.log(self.$item);
    $wrapper.append(self.$item);

    var $button = H5P.JoubelUI.createButton({
      title: 'set_input_field',
      text: 'Set input field (Joubel)',
      click: function (event) {
        event.preventDefault();

        var mathquillCommandIdArray = [];
        // get lastMutation (global var) from mutationObserver
        lastMutation.each(function () {
          var $node = H5P.jQuery(this);
          // console.log($node);
          // console.log($node.html());
          var mathquillCommandId = $node[0].attributes['mathquill-command-id'].value;
          // console.log(mathquillCommandId);
          mathquillCommandIdArray.push(mathquillCommandId);
        });
        console.log(mathquillCommandIdArray);
        var url = window.parent.parent.document.URL;
        window.parent.parent.postMessage(["setInputFieldEvent", mathquillCommandIdArray], url);

        // const si_ev = new Event('setInputFieldEvent', {
        //   bubbles: true,
        //   cancelable: true,
        //   composed: false
        // });
        // si_ev.data = 4711;
        // // console.log('TRIGGER setInputFieldEvent (formulaapplet-editor.js)');
        // document.dispatchEvent(si_ev);

      }
    });
    $button.attr('id', '#set-input-h5p');
    $button.on('mouseover', buttonMouseoverHandler);
    $wrapper.append($button);
    // $wrapper.append('<textarea id="html-output" rows="4" cols="150">output</textarea>');

    $(function () {
      //code that needs to be executed when DOM is ready, after manipulation
      // console.log('append html-output');
      var texinputparent = H5P.jQuery('div.field.field-name-TEX_expression.text input').parent();
      // console.log(texinputparent);
      texinputparent.append('<br><br><textarea id="html-output" rows="4" cols="150">output</textarea>');
      afterAppend(self);
      waitForMainThenDo(afterMainIsLoaded);
    });
  };

  function buttonMouseoverHandler(ev) {
    console.log(ev);
    var url = window.parent.parent.document.URL;
    window.parent.parent.postMessage(["setInputFieldMouseoverEvent", 'dummy'], url);
  };

  function afterMainIsLoaded() {
    // this code is executed if main is loaded
    console.log('*** MAIN is loaded *** ');

    console.log('check items of editor page after MAIN is loaded, before preparePage/prepareEditorApplet');
    // var params = FormulaAppletEditor.getExpression();
    console.log(this.H5PEditor);


    // console.log('postMessage preparePageEvent');
    // console.log('TRIGGER testEvent');
    // trigger event fails because target is in parent iframe
    // H5P.jQuery(document).trigger('preparePageEvent');
    var url = window.parent.parent.document.URL;
    window.parent.parent.postMessage("preparePageEvent", url);
    window.parent.parent.postMessage("testEvent", url);
    //TODO wait for preparePage to have finished
    setTimeout(function () { //give preparePage one second
      // installDOMSubtreeModifiedHandler();
      installMutationObserver();
    }, 1000);
    H5P.jQuery(window.parent.parent.document).trigger('testEvent');
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
  // console.log('formulaapplet-editor.js: afterAppend - window.name = ' + window.name);
  // console.log(obj);



  // teximput is updated by editor.js: showEditorResults

  var texinput = H5P.jQuery('div.field.field-name-TEX_expression.text input')[0];
  texinput.addEventListener('input', updateTexinputEventHandler);

  function updateTexinputEventHandler(event) {
    obj.parent.params['fa_applet'] = event.target.value;
    var msg;
    if (event.isTrusted) {
      msg = ' event caused by keyboard input';
      event.preventDefault();
    } else {
      msg = ' event caused by input to FormulaApplet';
      //event caused by JavaScript, especially input to FormulaApplet: let event be captured
    }
    console.log('TEX_expression changed: ' + event.target.value + msg);
    // do not yet update formulaAppletEditor widget , because editorMf and editorMf.latex() is not available
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
    console.log('formulaAppletMode ' + this.name + ' ' + this.value);
  });

  // hide field-name-id
  H5P.jQuery('.field-name-id').css('display', 'none');

}

// function installDOMSubtreeModifiedHandler() {
//   // has to be done after mathquillifying, i. e. after preparePage
//   // eventHamdler for DOMSubtreeModified
//   var $rootBlock = H5P.jQuery('#math-field').find('.mq-root-block');
//   console.log('$rootBlock.html()=' + $rootBlock.html());
//   $rootBlock.on('DOMSubtreeModified', DOMSubtreeModifiedHandler);
// }

function installMutationObserver() {
  var $rootBlock = H5P.jQuery('#math-field').find('.mq-root-block');
  let RootblockObserver = new MutationObserver(RootblockMutationHandler);
  RootblockObserver.observe($rootBlock[0], {
    //config
    childList: true, // observe direct children
    subtree: true, // and lower descendants too
    characterData: true,
    characterDataOldValue: false // pass old data to callback
  });
}

//TODO get rid of global var
var lastMutation = {};

function RootblockMutationHandler(mutations) {
  mutations.forEach(function (mutation) {
    var newNodes = mutation.addedNodes; // DOM NodeList
    if (newNodes !== null) { // If there are new nodes added
      var $nodes = H5P.jQuery(newNodes).clone(); // jQuery set
      // console.log('+++');
      // console.log($nodes);
      if ($nodes.html() !== 'undefined') {
        // $nodes.each(function () {
        //   var $node = H5P.jQuery(this);
        //   console.log($node.html());
        // });
        lastMutation = $nodes;
      }
    }
  });
}

//TODO get rid of global variables
// var $rootBlock = H5P.jQuery('#math-field').find('.mq-root-block');

// function DOMSubtreeModifiedHandler(ev) {
//   try {
//     // var $selection = $rootBlock.find('.mq-selection');
//     var $selection = H5P.jQuery(ev.target);
//     var selectionHTML = $selection.html();
//     if (typeof selectionHTML !== 'undefined' && selectionHTML.length > 0) {
//       selectionArray.push($selection.clone());
//     }
//   } catch (error) {
//     console.log('ERROR: ' + error);
//   }
// };

//TODO get rid of global variables
// var DOMSubtreeModifiedEventHandlerActive = true;
// $rootBlock.on('DOMSubtreeModified', function (ev) {
//     if (DOMSubtreeModifiedEventHandlerActive) {
//         // console.log('DOMSubtreeModified');
//         try {
//             var $selection = $rootBlock.find('.mq-selection');
//             var selectionHTML = $selection.html();
//             if (typeof selectionHTML !== 'undefined' && selectionHTML.length > 0) {
//                 if (selectionHTML !== $rememberSelection_new.html()) {
//                     $rememberSelection_old = $rememberSelection_new.clone();
//                     $rememberSelection_new = $selection.clone();
//                     // console.log('old=' + $rememberSelection_old.html());
//                     // console.log('new=' + $rememberSelection_new.html());
//                     // console.log(' ');
//                     selectionArray.push($rememberSelection_new);
//                     eventArray.push(ev);
//                     // console.log(selectionArray);
//                 }
//                 //     //   DOMSubtreeModifiedEventHandlerActive = false;
//                 //     //   this.innerHTML = 'µ';
//                 //     //   DOMSubtreeModifiedEventHandlerActive = true;
//             } else {
//                 // console.log('no selection');
//             }
//         } catch (error) {
//             console.log('ERROR: ' + error);
//         }
//     }
// });

// $rootBlock.on('select', function () {
//     console.log('select event');
// });
// $rootBlock.on('selectionchange', function () {
//     console.log('selectionchange event');
// });




// next lines are part of waitForMain mechanism
// event listener listens to echoes from main.js
var mainIsLoaded = 0; //TODO get rid of global var
window.parent.parent.addEventListener('message', handleEchoMessage, true); //capturing phase
// console.info('LISTEN to message (formulaapplet-editor.js) !!!');

function handleEchoMessage(event) {
  if (event.data == 'echoFromMainEvent') {
    mainIsLoaded += 1;
    console.info('RECEIVE message echoFromMainEvent (formulaapplet-editor.js) mainIsLoaded=' + mainIsLoaded);
  }
}

var try_counter = 0;
var try_counter_limit = 10;

function waitForMainThenDo(cont) {
  if (mainIsLoaded == 1) {
    // execute callback onld the first time called
    cont();
  } else {
    try_counter++;
    var url = window.parent.parent.document.URL;
    window.parent.parent.postMessage("SignalToMainEvent", url);
    // send another echo to main.js. If echo comes back, mainIsLoaded = true
    console.info('post message SignalToMainEvent (formulaapplet-editor.js) try=' + try_counter);
    if (try_counter < try_counter_limit) {
      setTimeout(function () {
        // recurse
        waitForMainThenDo(cont);
      }, 300);
    } else {
      console.error('waitForMainThenDo: Timeout');
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