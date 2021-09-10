// https://h5p.org/library-development

H5P.FormulaApplet = (function ($) {

  /**
   * @class H5P.FormulaApplet
   * @param {Object} params
   */
  function FormulaApplet(params) {
    var $wrapper;
 
    this.attach = function ($container) {
      if ($wrapper === undefined) {
        $wrapper = $('<div/>', {
          html: 'Hello Expression: ' + params.expression
        });
      }
 
      $container.html('').addClass('h5p-mylib').append($wrapper);
    };
  }
 
  return FormulaApplet;
})(H5P.jQuery);

