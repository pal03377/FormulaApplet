// https://requirejs.org/docs/api.html#jsfiles
// https://requirejs.org/docs/api.html#pathsfallbacks
libLoad.libLoaderReady = false;
requirejs.config({
  //To get timely, correct error triggers in IE, force a define/shim exports check.
  //enforceDefine: true,
  paths: {
    jquery: [
      'https://code.jquery.com/jquery-3.4.1.min',
      //Fallback - If the CDN location fails, load from this location
      '/js/lib/jquery-3.4.1.min'
    ],
    mathquill: [
      'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill',
      '/js/lib/mathquill-0.10.1/mathquill' //fallback
    ],
    algebrite: [
      'http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser',
      '/js/lib/Algebrite/dist/algebrite.bundle-for-browser'
    ],
    domReady: '/js/domReady/domReady'
  }
});

function loadCss(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}

function init_mathquill() {
  console.log('Lib-Loader: Init MathQuill');
  MQ = MathQuill.getInterface(2); // for backcompat
  mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function () { // useful event handlers
       latexSpan.textContent = mathField.latex(); // simple API
      }
    }
  });
  // console.log(mathField);
}

mathFieldSpan = document.getElementById('math-field');
latexSpan = document.getElementById('latex');

// Start the main app logic.
require(['jquery'], function ($) {
  console.log('jQuery is loaded');
  require(['mathquill'], function (MQ) {
    console.log('MathQuill.js is loaded');
    loadCss('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css');
    console.log('MathQuill.css is loaded');
    require(['algebrite'], function (Algebrite) {
      console.log('Algebrite is loaded');
        // https://api.jquery.com/ready/
        $( function(){ 
          libLoad.libLoaderReady = true;
          // console.log( 'libLoader:=true' );
          init_mathquill();
        });
    });
  });
});
