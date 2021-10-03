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
      bli: 'bla'
    }, options);
    // Keep provided id.
    this.id = id;
    // console.log('constructed:' + id);
    // console.log(this);
    this.options.TEX_expression = this.options.fa_applet;
    console.log(this.options);
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

    // console.log('append to container');
    var html = '<p class="formula_applet" id="' + this.options.id + '"';
    if (this.options.formulaAppletPhysics == true) {
      html += ' mode="physics"';
    }
    if (this.options.formulaAppletMode == 'manu') {
      html += ' data-b64="' + this.options.data_b64 + '"';
    }
    html += '">' + this.options.fa_applet + '</p>';
    console.log('append: ' + html);
    $container.append(html, afterAppend(this.options.id));
    console.log('formulaAppletPhysics=' + this.options.formulaAppletPhysics);
    console.log('formulaAppletMode=' + this.options.formulaAppletMode);

    this.on('buttonPressed', function (event) {
      var buttonText = event.data;
      console.log('Someone pressed the ' + buttonText + ' button!');
    });
  };

  return C;
})(H5P.jQuery);


function afterAppend(id) {
  // self.$.trigger('resize');
  H5P.jQuery(document).trigger('resize');
  console.log('afterAppend: trigger preparePageEvent');
  H5P.jQuery(document).trigger('preparePageEvent');
  H5P.jQuery(document).trigger('mathquillifyEvent', id);

}