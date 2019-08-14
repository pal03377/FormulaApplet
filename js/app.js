// https://requirejs.org/docs/api.html#jsfiles
// https://requirejs.org/docs/api.html#pathsfallbacks

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
    algebralatex: [
      '/js/lib/algebra-latex/lib/index'
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

function load_3() {
  console.log('Here is load_3');
  var mathFieldSpan = document.getElementById('math-field');
  var latexSpan = document.getElementById('latex');

  var MQ = MathQuill.getInterface(2); // for backcompat
  var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
      edit: function () { // useful event handlers
        latexSpan.textContent = mathField.latex(); // simple API
      }
    }
  });
}

// Start the main app logic.
require(['jquery'], function ($) {
  console.log('jquery is loaded');
  require(['mathquill'], function (MQ) {
    console.log('MathQuill.js is loaded');
    loadCss('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css');
    load_3();
    console.log('MathQuill.css is loaded');
  });
});
require(['algebrite'], function (Algebrite) {
  console.log('Algebrite is loaded');
});
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
// var module = {'exports': {}};
// require(['algebralatex'], function (alglat) {
//   console.log('Algebra-Latex is loaded');
// });
require(['domReady'], function (domReady) {
  domReady(function () {
    //This function is called once the DOM is ready.
    //It will be safe to query the DOM and manipulate
    //DOM nodes in this function.
    console.log('domReady');
  });
});