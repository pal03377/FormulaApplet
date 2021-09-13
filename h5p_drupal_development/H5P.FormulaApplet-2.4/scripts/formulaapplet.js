var H5P = H5P || {};
console.log('Here is formulaapplet.js');

H5P.FormulaApplet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    this.$ = $(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      expression: '\\frac{2x-5}{7-3x}',
      image: null
    }, options);
    // Keep provided id.
    this.id = id;
  };

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    var self = this;
    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-formulaapplet");
    // Add image if provided.
    if (this.options.image && this.options.image.path) {
      $container.append('<img class="formula-image" src="' + H5P.getPath(this.options.image.path, this.id) + '">');
    }
    // Add greeting text.
	// $container.append('<p class="formula_applet" style="font-size:18pt; padding:10px" id="int_sin" data-b64="N2zCC">\\int_{0}^{\\pi}\\sin\\left(x\\right)dx = {{result}}</p><br />');
	// $container.append('<p class="formula_applet" id="sin90">\\sin\\left(\\alpha+ 90°\\right)={{result}}</p><br>');

    $container.append('<p class="formula_applet" id="' + this.options.id + '">' + this.options.expression + '</p>');

    // TODO - need to wait for image beeing loaded
    // For now using timer. Should wait for image is loaded...
    setTimeout(function () {
      self.$.trigger('resize');
	  self.$.trigger('preparePageEvent');
    }, 2000);
  };

  return C;
})(H5P.jQuery);

// var script = document.createElement( 'script' );
// script.type = 'text/javascript';
// script.src = "http://localhost/drupal/sites/default/files/h5p/development/H5P.FormulaApplet-2.4/scripts/bundle.js";
// document.getElementsByTagName('head')[0].appendChild( script );
// H5P.jQuery("head").append( script );

// setTimeout(function () {
  // console.log('trigger preparePageEvent');
  // H5P.jQuery(document).trigger('preparePageEvent');
// }, 100);
