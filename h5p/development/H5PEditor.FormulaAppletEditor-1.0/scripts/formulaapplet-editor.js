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
    console.log('FormulaApplet constructed:');
    // console.log(this);
    // console.log('this.field:');
    // console.log(this.field);
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
    console.log(params);
    var html = '<p class="formula_applet edit" id="' + params.id + '"';
    if (params.formulaAppletPhysics == true) {
      html += ' mode="physics"';
    }
    if (params.formulaAppletMode == 'manu') {
      html += ' data-b64="' + params.data_b64 + '"';
    }
    // html += '">' + params.TEX_expression + '</p>';
    html += '>';

    // var html = H5PEditor.createFieldMarkup(this.field, '<p id="' + id + '" class="formula_applet edit">egal', id);
    var fieldMarkup = H5PEditor.createFieldMarkup(this.field, html, id);
    self.$item = H5PEditor.$(fieldMarkup);
    self.$formulaApplet = self.$item.find('.formula_applet');
    self.$formulaApplet.text(params.TEX_expression);
    self.$formulaApplet[0].innerHTML = '<span id="math-field">' + self.$formulaApplet[0].innerHTML + '</span>'
    // console.log(self.$formulaApplet[0]);
    // const id2 = ns.getNextFieldId(this.field);
    // var html2 = '<button type="button" class="tr de sif problemeditor" id="set-input-d" >Eingabe-Feld setzen</button>';
    // var fieldMarkup2 = H5PEditor.createFieldMarkup(this.field, html2, id2);
    // $wrapper.append(H5PEditor.$(fieldMarkup2));


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
    // console.log('append:');
    // console.log(self.field);
    $wrapper.append(self.$item);
    // console.log('appended to:');
    // console.log($wrapper);
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
  console.log('afterAppend wait 100ms then...');
  setTimeout(function () {
    H5P.jQuery(document).trigger('resize');
    console.log('trigger preparePageEvent');
    H5P.jQuery(document).trigger('preparePageEvent');
  }, 100);
  console.log(obj.parent.params);

  var checkbox = document.getElementById(getSelectorID('field-formulaappletphysics'));
  console.log(checkbox);
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      console.log("Physics Mode");
      // test();
    } else {
      console.log("Math Mode");
      // test();
    }
  });

  // function test() {
  //   var texinput = H5P.jQuery('div.field.field-name-TEX_expression.text input')[0];
  //   // console.log(texinput);
  //   if (typeof texinput !== 'undefined') {
  //     H5P.jQuery(texinput).val('TestTestTest');
  //     // fireEvent(texinput, 'change');
  //     texinput.dispatchEvent(new InputEvent('input', {
  //       bubbles: true
  //     }))

      
  //     // texinput.value = 'TestTestTest';
  //     // obj.parent.params.TEX_expression = 'a^2+b^2=c^2';
  //     // texinput.setAttribute('value', tex);
  //     console.log(texinput.value);
  //   } else {
  //     console.log('no TEX_expression found');
  //   }

  // }

  var texinput = H5P.jQuery('div.field.field-name-TEX_expression.text input')[0];
  texinput.addEventListener('input', updateTexinput);

  function updateTexinput(e) {
    // console.log('updateTexinput ' + e.target.value);
    obj.parent.params['fa_applet'] = e.target.value;
  }

  var formulaAppletMode = document.getElementById(getSelectorID('field-formulaappletmode'));
  // console.log(formulaAppletPhysics);
  formulaAppletMode.addEventListener('change', function (e) {
    // console.log(this);
    console.log(this.name + ' ' + this.value);
  });
  console.log('listening to input event');
  // console.log(ns);

  // create 'set input field' button
  var anchor = H5P.jQuery('div.field.field-name-fa_applet.text.formulaAppletEditor');
  console.log(anchor);
  var html = '<button type="button" class="problemeditor" id="set-input-e" style="">Set input field</button>'
  H5P.jQuery(html).appendTo(anchor);
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

// /**
//  * https://stackoverflow.com/questions/2381572/how-can-i-trigger-a-javascript-event-click
//  * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
//  * by testing for a 'synthetic=true' property on the event object
//  * @param {HTMLNode} node The node to fire the event handler on.
//  * @param {String} eventName The name of the event without the "on" (e.g., "focus")
//  */
//  function fireEvent(node, eventName) {
//   // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
//   var doc;
//   if (node.ownerDocument) {
//       doc = node.ownerDocument;
//   } else if (node.nodeType == 9){
//       // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
//       doc = node;
//   } else {
//       throw new Error("Invalid node passed to fireEvent: " + node.id);
//   }

//    if (node.dispatchEvent) {
//       // Gecko-style approach (now the standard) takes more work
//       var eventClass = "";

//       // Different events have different event classes.
//       // If this switch statement can't map an eventName to an eventClass,
//       // the event firing is going to fail.
//       switch (eventName) {
//           case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
//           case "mousedown":
//           case "mouseup":
//               eventClass = "MouseEvents";
//               break;

//           case "focus":
//           case "change":
//           case "blur":
//           case "select":
//               eventClass = "HTMLEvents";
//               break;

//           default:
//               throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
//               break;
//       }
//       var event = doc.createEvent(eventClass);
//       event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

//       event.synthetic = true; // allow detection of synthetic events
//       // The second parameter says go ahead with the default action
//       node.dispatchEvent(event, true);
//   } else  if (node.fireEvent) {
//       // IE-old school style, you can drop this if you don't need to support IE8 and lower
//       var event = doc.createEventObject();
//       event.synthetic = true; // allow detection of synthetic events
//       node.fireEvent("on" + eventName, event);
//   }
// };