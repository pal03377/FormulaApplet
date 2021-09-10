/**
 * Color selector widget module
 *
 * @param {H5P.jQuery} $
 */
H5PEditor.widgets.colorSelector = H5PEditor.ColorSelector = (function ($) {
 
  /**
   * Creates color selector.
   *
   * @class H5PEditor.ColorSelector
   *
   * @param {Object} parent
   * @param {Object} field
   * @param {string} params
   * @param {H5PEditor.SetParameters} setValue
   */
  function C(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
  }
   
  /**
   * Append the field to the wrapper.
   *
   * @param {H5P.jQuery} $wrapper
   */
  C.prototype.appendTo = function ($wrapper) {
    var self = this;
 
    self.$container = $('<div>', {
      'class': 'field text h5p-color-selector'
    });
 
    // Add header:
    $('<span>', {
      'class': 'h5peditor-label',
      html: self.field.label
    }).appendTo(self.$container);
 
    // Create input field
    self.$colorPicker = $('<input>', {
      'type': 'text',
      'class': 'h5p-color-picker'
    }).appendTo(self.$container);
 
    // Create color picker widget
    self.$colorPicker.spectrum({
      preferredFormat: 'hex',
      color: self.getColor(),
      change: function (color) {
        self.setColor(color);
      }
    });
 
    // Add description:
    $('<span>', {
      'class': 'h5peditor-field-description',
      html: self.field.description
    }).appendTo(self.$container)
 
    self.$container.appendTo($wrapper);
  };
  /**
   * Validate the current values.
   *
   * @returns {boolean}
   */
	C.prototype.validate = function () {
		return (this.params.length === 6);
	};
	
	C.prototype.setColor = function (color) {
	  this.params = color.toHex();
	  this.setValue(this.field, this.params);
	};
  /**
   * Remove the current field
   */
  C.prototype.remove = function () {};
 
  return C;
})(H5P.jQuery);
