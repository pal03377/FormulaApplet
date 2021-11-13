var H5P = H5P || {};
console.log('Here is formulaapplet.js 2.9-off');

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
    this.options.TEX_expression = this.options.fa_applet;
    // console.log(this.options);
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
    html += '>' + this.options.fa_applet + '</p>';
    // html = '<p>DEBUG formulaapplet.js DEBUG</p>';
    console.log('formulaapplet: append ' + html);
    // console.log($container);
    $container.append(html, afterAppend(this.options.id));
    var id = this.options.id;
    // console.log('id=' + id);
    waitForMain(function () {
      // console.log('window.mainIsLoaded ' + window.mainIsLoaded);
      if (window.mainIsLoaded == 1) {
        console.log('MAIN is loaded');
        window.mainIsLoaded = 2; // prevent from doing twice
      }
      // console.log('TRIGGER mathquillifyEvent (formulaapplet.js) with id=' + id);
      H5P.jQuery(document).trigger('mathquillifyEvent', id);
    }, id);
  };
  return C;
})(H5P.jQuery);

var try_counter = 0;
var try_counter_limit = 30;

function waitForMain(cont, parm) {
  if (window.mainIsLoaded > 0) {
    cont();
  } else {
    try_counter++;
    // console.log('Waiting for main: ' + try_counter);
    if (try_counter < try_counter_limit) {
      setTimeout(function () {
        waitForMain(cont, parm);
      }, 300);
    } else {
      console.error('waitForMain: Timeout');
    }
  }
}

var chainTimerId = -1;
var chainTimerInterval = 2000; //millisec
var chainTimerFinished = function () {
  console.log('TRIGGER preparePageEvent (formulaapplet.js)');
  H5P.jQuery(document).trigger('preparePageEvent');
};

function chainTimer() {
  if (chainTimerId !== -1) {
    // stop timer, wait with chainTimerFinished
    clearTimeout(chainTimerId);
    // console.log('Timer ' + chainTimerId + ' stopped.');
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