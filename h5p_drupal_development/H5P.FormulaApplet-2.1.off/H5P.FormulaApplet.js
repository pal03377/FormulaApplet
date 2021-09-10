var H5P = H5P || {};
 
H5P.FormulaApplet = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, id) {
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      // expression: '(2u + 7v)^2 = 4u^2 + 28uv + {{result}}',
      expression: 'dummy expression',
	 ident: '68754egg'
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
    // Set class on container to identify it as a furmula applet
    // container.  Allows for styling later.
    $container.addClass("h5p-formulaapplet");
	console.log(this);
	console.log('this.options.expression=' + this.options.expression);
 	console.log('this.options.ident=' + this.options.ident);
    if (this.options.expression && this.options.ident) {
		$container.append('<p class="formula_applet" id="' + this.options.ident + '">' + this.options.expression + '</p><br />');
		// $container.append('<p class="formula_applet" id="binom_02">(2u + 7v)^2 = 4u^2 + 28uv  + \\MathQuillMathField{}</p><br />' + 
		// '<p class="formula_applet" id="light-house" data-b64="gOmkT">s=\\sqrt{ h^2 + \\MathQuillMathField{} }</p><br />');
    }
	// prepare_pg(); is called by glue_h5p!

    };
    return C;
})(H5P.jQuery);