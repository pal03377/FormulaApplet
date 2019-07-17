function waitfor_loadjs(loadjs_ready) {
  if (loadjs) {
    loadjs_ready();
  } else {
    setTimeout(function () { waitfor_loadjs(loadjs_ready) }, 50);
  }
}

waitfor_loadjs(function () {
  console.log("loadjs is now loaded");
});

load_lib_or_fallback('https://code.jquery.com/jquery-3.4.1.min.js', '/js/lib/jquery-3.4.1.min.js', function () { });  // MathQuill needs jQuery 1.5.2+

// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
function waitfor_jquery(jquery_ready) {
  if (window.jQuery) {
    jquery_ready();
  } else {
    setTimeout(function () { waitfor_jquery(jquery_ready) }, 50);
  }
}

waitfor_jquery(function () {
  console.log("jQuery is now loaded");
  $(function () {
    load_1();

    function load_1{
      loader_log(out_log, 'DOM ready.', 'ok');
      load_2();
    }

    // mathquill: local lib from https://github.com/mathquill/mathquill/releases/download/v0.10.1/mathquill-0.10.1.zip (NOT source, lacks of mathquill.js)

    function load_2() {
      load_lib_or_fallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css', '/js/lib/mathquill-0.10.1/mathquill.css', function () { });
      load_lib_or_fallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js', '/js/lib/mathquill-0.10.1/mathquill.js', load_3);
    }

    function load_3() {
      load_lib_or_fallback('http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js', '/js/lib/Algebrite/dist/algebrite.bundle-for-browser.js', load_4)  // MathQuill needs jQuery 1.5.2+
    }

    function load_4() {
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
      load_5();
    }

    function load_5() {
      loader_log(out_log, 'Load complete.', '');
    }

  });

});

function loader_log(logger, message, state) {
  var d = new Date(), ts;
  ts = d.toLocaleTimeString().split(' ');
  //console.log(ts);
  ts = ts[0] + '.' + d.getMilliseconds() + ' ';
  message = ts + message;
  if (state == 'error') {
    message += ' <span style="color:red">ERROR</span>'
  }
  if (state == 'ok') {
    message += ' <span style="background:lightgrey; color:green">OK</span>'
  }
  logger.innerHTML += '</br>' + message;
}

out_log = document.getElementById('load_logger');
function load_lib_or_fallback(load_url, fallback, after_fn) {
  loadjs([load_url], { returnPromise: true })
    .then(function () { loader_log(out_log, load_url + ' loaded', 'ok'); after_fn() })
    .catch(function (pathsNotFound) {
      loader_log(out_log, 'Error loading ' + load_url, 'error');
      loadjs([fallback], { returnPromise: true })
        .then(function () { loader_log(out_log, fallback + ' (local) loaded', 'ok'); after_fn() })
        .catch(function (pathsNotFound) { loader_log(out_log, 'Error loading ' + fallback + ' (local)', 'error') });
    });
}

