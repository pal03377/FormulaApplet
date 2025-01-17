﻿var H5P = H5P || {};
console.log('Here is formulaapplet.js 2.10 - window.name = ' + window.name);
console.log(H5P);

H5P.FormulaApplet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      bli: 'bla'
    }, options);
    // Keep provided id.
    this.id = id;
    // this.options.TEX_expression = this.options.fa_applet;
  };

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    var self = this;
    $container.addClass("h5p-formulaapplet");

    var html = '<p class="formula_applet" id="' + this.options.id + '"';
    if (this.options.formulaAppletPhysics == true) {
      html += ' mode="physics"';
    }
    if (this.options.formulaAppletMode == 'manu') {
      html += ' data-b64="' + this.options.data_b64 + '"';
    } else {
      this.options.data_b64 = 'automatic solution';
    }
    html += '>' + this.options.TEX_expression + '</p>'; //do not use fa_applet
    // debugging
    html += '<p>' + this.options.id + '</p>';
    html += '<p>' + this.options.data_b64 + '</p>';
    
    // console.log(this.options.TEX_expression);
    console.log(html);
    $container.append(html, afterAppend(this.options.id));
    // var testhtml = '<p>' + this.options.test + '</p>';
    // $container.append(testhtml, afterAppend(this.options.id));
  };
  return C;
})(H5P.jQuery);

function afterAppend(id) {
  // self.$.trigger('resize');
  H5P.jQuery(document).trigger('resize');
  H5Pbridge.mathQuillify(id);
}