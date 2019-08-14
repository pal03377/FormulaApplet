var tasks = [
  {
    "library": "https://code.jquery.com/jquery-3.4.1.min.js",
    "fallback": "/js/lib/jquery-3.4.1.min.js",
    "post_function": ""
  },
  {
    "library": "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css",
    "fallback": "/js/lib/mathquill-0.10.1/mathquill.css",
    "post_function": ""
  },
  {
    "library": "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js",
    "fallback": "/js/lib/mathquill-0.10.1/mathquill.js",
    "post_function": ""
  },
  {
    "library": "http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js",
    "fallback": "/js/lib/Algebrite/dist/algebrite.bundle-for-browser.js",
    "post_function": "load_3"
  }
];

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

function waitfor_loadjs(loadjs_ready) {
  if (typeof loadjs !== 'undefined') {
    loadjs_ready();
  } else {
    setTimeout(function () { waitfor_loadjs(loadjs_ready) }, 50);
  }
}

var task_index = 0;
waitfor_loadjs(function () {
  console.log("loadjs is now loaded");
  load_library_or_fallback(task_index);
});

function load_library_or_fallback(task_index) {
  console.log("Do task #" + task_index);
  if (task_index < tasks.length) {
    var task = tasks[task_index];
    var lib = task.library;
    var bundle = 'bundle' + task_index;
    loadjs([lib], bundle, {
      success: function () {
        console.log(lib + ' loaded');
        var fn = task.post_function;
        //console.log('fn=' + fn);
        if (fn !== "") {
          // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
          window[fn]();
        }
        task_index += 1;
        // console.log('new task_index=' + task_index);
        load_library_or_fallback(task_index);
      },
      error: function (pathsNotFound) {
        // try fallback
        console.log(lib + ' load ERROR ');
        lib = task.fallback;
        var bundle = 'bundle2_' + task_index;
        loadjs([lib], bundle, {
          success: function () {
            console.log(lib + ' loaded');
            // var fn = task.post_function;
            console.log('fn=' + fn);
            if (fn !== "") {
              window[fn]();
            }
            task_index += 1;
            // console.log('new task_index=' + task_index);
            load_library_or_fallback(task_index);
          },
          error: function (pathsNotFound) {
            console.log('ERROR loading fallback ' + pathsNotFound)
          }
        });
      }
    });

  } else {
    console.log('No more tasks.');
  }
}