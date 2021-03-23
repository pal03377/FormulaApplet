// This is glue.js 
// This filename is referred to in D:\Users\privat\Documents\xampp_gf09_wiki\htdocs\wiki\extensions\FormulaApplet\extension.json
// and in D:\Users\privat\Laufwerk_E\gut\gf09\header.php

if (typeof gf09_path == 'undefined') {
    console.log('gf09_path undefined. This should not happen because it is defined in header.php or FormulaApplet.body.php');
}
var jsPath = gf09_path + 'js/';
var js_bootstrapPath = gf09_path + 'js_bootstrap/';
var libPath = jsPath + 'lib/';
var cssPath = gf09_path + 'css/';
var css_bootstrapPath = gf09_path + 'css_bootstrap/';
console.log('gf09_path=' + gf09_path + ' jsPath=' + jsPath + ' libPath=' + libPath + '  cssPath=' + cssPath);

if (typeof liblist === 'undefined') {
    // default for wiki
    var liblist = ['mathquill', 'prepare_page', 'tex_parser', 'decode', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss', 'hammer', 'translate'];
}

function task(source) {
    this.name = 'unknown';
    this.source = source;
    this.fallback = null;
    this.state = 'unused'; //delete?
}

// var jQuery_url = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
// var jQuery_fallback = libPath + "jquery-3.4.1.min.js";
var tasks = {};
tasks['mathquillcss'] = new task(libPath + 'mathquill-0.10.1/mathquill.css');
tasks['mathquillcss'].fallback = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css';
tasks['mathquill'] = new task(libPath + 'mathquill-0.10.1/mathquill.min.js');
tasks['mathquill'].fallback = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js';
tasks['algebrite'] = new task('http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js');
tasks['algebrite'].fallback = libPath + 'Algebrite/dist/algebrite.bundle-for-browser.js';
tasks['kas'] = new task(libPath + 'KAS/KAS_loader.js');
tasks['hammer'] = new task(libPath + 'hammer.js');
tasks['hammer'].fallback = 'https://hammerjs.github.io/dist/hammer.js';
tasks['bootstrap'] = new task('https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js');
tasks['bootstrap'].fallback = js_bootstrapPath + 'bootstrap.min.js';
tasks['bootstrapcss'] = new task('https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
tasks['bootstrapcss'].fallback = css_bootstrapPath + 'bootstrap.min.css';
// without fallback
tasks['tex_parser'] = new task(jsPath + 'tex_parser.js');
tasks['tree_canvas'] = new task(jsPath + 'tree_canvas.js');
tasks['tree2tex'] = new task(jsPath + 'tree2tex.js');
tasks['vkbd'] = new task(jsPath + 'vkbd.js');
tasks['decode'] = new task(jsPath + 'decode.js');
tasks['translate'] = new task(jsPath + 'translate.js');
tasks['prepare_page'] = new task(jsPath + 'prepare_page.js');
tasks['gf09css'] = new task(cssPath + 'gf09.css');
tasks['vkbdcss'] = new task(cssPath + 'vkbd.css');
tasks['tablecss'] = new task(cssPath + 'table.css');
tasks['bootstrapcss'] = new task(css_bootstrapPath + 'bootstrap.css');
tasks['collapse_help'] = new task(js_bootstrapPath + 'bootstrap.collapse_helper.js');
tasks['popper'] = new task('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js');

var keys = Object.keys(tasks);
for (var i = 0; i < keys.length; i++) {
    var taskname = keys[i];
    tasks[taskname].name = taskname;
}

// .forEach causes error 'foeEach is not a function' - maybe typescript error
// liblist.forEach(function (taskname) {
//     tasks[taskname].name = taskname;
// })

jq = new task("https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js");
jq.fallback = libPath + "jquery-3.4.1.min.js";
jq.name = 'jq';
var try_counter_limit = 50;
// do not add jq to tasks[]!

// start loading of jQuery (if necessary)
if (window.jQuery) {
    // jQuery is already there.
    console.log('jQuery version (Wiki) = ' + $.fn.jquery);
    load_libs();
} else {
    // Start to load jQuery 
    appendScriptOrStyleSheetWithFallback(jq);
    // and wait until loaded
    var try_counter = 0;
    waitfor_jquery(load_libs);
}
// Done with jQuery.

function jquery_timeout() {
    console.log('Load of jQuery: timeout. Stop of loading');
}

var try_counter = 0;

function waitfor_jquery(cont) {
    //TODO replace by use of script.onerror
    // console.log( 'window.jQuery =' + window.jQuery);
    if (window.jQuery) {
        console.log('jQuery version = ' + $.fn.jquery);
        cont();
    } else {
        try_counter++;
        console.log('Waiting for jQuery... ' + try_counter);
        if (try_counter < try_counter_limit) {
            setTimeout(function () {
                waitfor_jquery(cont);
            }, 50);
        } else {
            jquery_timeout();
        }
    }
}

function OK_Func(ev, task, isFallback) {
    var message = task.name + ' - Success loading ' + task.source;
    if(isFallback){
        console.log(tasks[task.name]);
        // message = task.name + ' - Success loading fallback - ' + tasks[task.name].fallback;
        message = task.name + ' - Success loading fallback';
    }
    if (task.name !== 'jq') {
        number_of_loaded_libs++;
        message += ' (' + number_of_loaded_libs + ')';
    }
    console.log(message);
    task.state = 'OK';
}

// ***************************** load CSS or JS *********************************** 
// https://stackoverflow.com/questions/17666785/check-external-stylesheet-has-loaded-for-fallback
// https://www.phpied.com/when-is-a-stylesheet-really-loaded/
function appendScriptOrStyleSheet(task, isFallback) {
    var elem;
    if (task.source.endsWith('.css')) {
        elem = document.createElement("link");
        elem.rel = "stylesheet";
        if (isFallback) {
            elem.href = task.fallback;
        } else {
            elem.href = task.source;
        }
    } else {
        // javascript
        // https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
        elem = document.createElement('script');
        elem.type = 'text/javascript';
        if (isFallback) {
            elem.src = task.fallback;
        } else {
            elem.src = task.source;
        }
    }
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    // https://www.w3schools.com/tags/ev_onload.asp
    elem.onreadystatechange = function (ev) {
        OK_Func(ev, task, isFallback);
    };
    elem.onload = function (ev) {
        OK_Func(ev, task, isFallback);
    };
    elem.onerror = function (ev) {
        // console.log(ev);
        if (task.fallback == null) {
            //console.log(task.name + '(1) ERROR - no fallback!');
        } else {
            //console.log(task.name + '(2): ' + task.fallback);
            // second try: isFallback = true
            appendScriptOrStyleSheet(task, true);
            //stop infinite loop
            task.fallback = null;
        }
    }
    // Fire the loading
    document.head.appendChild(elem);
}

function appendScriptOrStyleSheetWithFallback(task) {
    //console.log(task.name + '(1): ' + task.source);
    // first try: isFallback = false
    appendScriptOrStyleSheet(task, false);
}

function state() {
    //console.log('***');
    liblist.forEach(function (taskname) {
        var t = tasks[taskname];
        // console.log(taskname + ': ' + t.state+ ' ' + t.name);
        //console.log(taskname + ': ' + t.state);
    });
    // console.log('Hammer=' + (typeof Hammer));
    // console.log('***');
}

function waitfor_num_of_libs_then_do(cont) {
    if (number_of_loaded_libs == liblist.length) {
        cont();
    } else {
        // console.log('Not enough libs: ' + number_of_loaded_libs);
        setTimeout(function () {
            waitfor_num_of_libs_then_do(cont)
        }, 100);
    }
}

var number_of_loaded_libs = 0;

function load_libs() {
    //console.log(JSON.stringify(liblist));
    liblist.forEach(function (taskname) {
        tasks[taskname].state = 'wait for load';
    });
    // state();

    liblist.forEach(function (taskname) {
        var task = tasks[taskname];
        task.state = 'pending';
        appendScriptOrStyleSheetWithFallback(task);
    });
    waitfor_num_of_libs_then_do(prepare_pg);
}

function prepare_pg() {
    waitfor_mathquill_if_in_liblist_and_then_do(function () {
        //console.log('MathQuill ready (2)');
        // if (typeof prepare_page_exists !== 'undefined') {
        if (typeof prepare_page !== 'undefined') {
            //console.log('calling prepare_page...');
            prepare_page();
        } else {
            //console.log('prepare_page undefined');
        }
        if (typeof init !== 'undefined') {
            init();
        } else {
            //console.log('init undefined');
        }
    })
}

// used in prepare_pg
function waitfor_mathquill_if_in_liblist_and_then_do(mq_ready) {
    if (liblist.indexOf('mathquill') >= 0) {
        console.log('MathQuill in liblist. Waiting');
        waitfor_mathquill_and_if_ready_then_do(mq_ready);
    } else {
        mq_ready();
    }
}

// used by many *.php files
function waitfor_mathquill_and_if_ready_then_do(mq_ready2) {
    // console.log( typeof MathQuill );
    if ((typeof MathQuill) === "undefined") {
        //console.log('waiting for MathQuill...');
        setTimeout(function () {
            waitfor_mathquill_and_if_ready_then_do(mq_ready2)
        }, 100);
    } else {
        //console.log('MathQuill ready (1)');
        mq_ready2();
    }
}

function waitfor_hammer(hammer_ready) {
    if ((typeof Hammer) === "undefined") {
        console.log('waiting for Hammer...');
        setTimeout(function () {
            waitfor_hammer(hammer_ready)
        }, 50);
    } else {
        console.log('Hammer ready......');
        hammer_ready();
    }
}

function makeDraggable( object ){
    // dragElement(document.getElementById("vkbd"));
  // https://hammerjs.github.io/getting-started/
  var mc = new Hammer(object);

  var left_temp = 1;
  var top_temp = 1;
  var left_start = 1;
  var top_start = 1;
  mc.on("panstart panmove", function (ev) {
      if (ev.type == 'panstart') {
          left_start = object.offsetLeft;
          top_start = object.offsetTop;
          left_temp = left_start;
          top_temp = top_start;
      }
      if (ev.type == 'panmove') {
          left_temp = left_start + ev.deltaX;
          top_temp = top_start + ev.deltaY;
          object.style.left = left_temp + 'px';
          object.style.top = top_temp + 'px';
      }
  });
}