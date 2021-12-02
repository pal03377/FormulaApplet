var H5P = H5P || {};
console.log('Here is formulaapplet.js 2.10 - window.name = ' + window.name);

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
    }
    html += '>' + this.options.TEX_expression + '</p>'; //do not use fa_applet
    console.log(this.options.TEX_expression);
    $container.append(html, afterAppend(this.options.id));
    // var testhtml = '<p>' + this.options.test + '</p>';
    // $container.append(testhtml, afterAppend(this.options.id));
  };
  return C;
})(H5P.jQuery);

var chainTimerId = -1;
var chainTimerInterval = 1000; //millisec
var chainTimerFinished = function () {
  // console.log('Timer ' + chainTimerId + ' finished.');
  H5P.jQuery(document).trigger('preparePageEvent');
  // preparePageEvent may be replaced by mathquillifyEvent(id) in constructor
};

function chainTimer() {
  if (chainTimerId !== -1) {
    // stop timer, wait with chainTimerFinished
    clearTimeout(chainTimerId);
    console.log('ChainTimer stopped.');
  }
  // start next timer (or first timer) 
  chainTimerId = setTimeout(chainTimerFinished, chainTimerInterval);
  // console.log('Timer ' + chainTimerId + ' started.');
}


function afterAppend(id) {
  // self.$.trigger('resize');
  H5P.jQuery(document).trigger('resize');
  // wait with chainTimerFinished until the last timer has finished
  chainTimer();
}