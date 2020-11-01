// This filename is used in D:\Users\privat\Documents\xampp_gf09_wiki\htdocs\wiki\extensions\FormulaApplet\extension.json
// and in D:\Users\privat\Laufwerk_E\gut\gf09\header.php

if (typeof gf09_path == 'undefined') {
    var gf09_path = '/gf09/';
    var server = document.location.hostname;
    if (server.startsWith('test.grossmann.info')) {
        gf09_path = '/';
    }
}
var libPath = gf09_path + 'js/lib/';
var cssPath = gf09_path + 'css/';
console.log('libPath=' + libPath + '  cssPath=' + cssPath);

if (typeof liblist === 'undefined') { //default for wiki
    var liblist = ['mathquill', 'prepare_page', 'tex_parser', 'zip', 'mathquillcss', 'gf09css'];
}

function task(source) {
    this.name = 'unknown';
    this.source = source;
    this.fallback = null;
    this.css = source.endsWith('.css');
    this.state = 'unused';
}

var jQuery_url = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
var jQuery_fallback = libPath + "jquery-3.4.1.min.js";
var tasks = [];
tasks['mathquillcss'] = new task('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css');
tasks['mathquillcss'].fallback = libPath + 'mathquill-0.10.1/mathquill.css';
tasks['mathquill'] = new task('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js');
tasks['mathquill'].fallback = libPath + 'mathquill-0.10.1/mathquill.js';
tasks['algebrite'] = new task('http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js');
tasks['algebrite'].fallback = libPath + 'Algebrite/dist/algebrite.bundle-for-browser.js';
tasks['kas'] = new task(libPath + 'KAS/KAS_loader.js');
tasks['zip'] = new task(libPath + 'jszip/dist/jszip.min.js');
tasks['zip'].fallback = new task(libPath + 'jszip/dist/jszip.js');
tasks['tex_parser'] = new task(libPath + 'tex_parser.js');
tasks['vkbd'] = new task(libPath + 'vkbd.js');
tasks['prepare_page'] = new task(libPath + 'prepare_page.js');
tasks['hammer'] = new task(libPath + 'hammer.js');
tasks['hammer'].fallback = new task('https://hammerjs.github.io/dist/hammer.js');
tasks['gf09css'] = new task(cssPath + 'gf09.css');
tasks['vkbdcss'] = new task(cssPath + 'vkbd.css');
console.log(tasks);
liblist.forEach(function(taskname){
    tasks[taskname].name = taskname;
})

// Load jQuery (without using jQuery)

// helper function for loading, see:
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
function loadScript(url, callback) {
    var script = document.createElement('script');
    // script.type = 'text/javascript';
    script.src = url;
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;
    // Fire the loading
    document.head.appendChild(script);
}

// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
// defer -> waitfor_jquery    method -> cont
var try_counter = 0;
var try_counter_limit = 50;

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
            second_try();
        }
    }
}

function second_try() {
    console.log('Try to load jQuery fallback');
    try_counter = 0;
    loadScript(jQuery_fallback, waitfor_jquery(jQueryLoaded));
}

// start loading of jQuery (if necessary)
if (window.jQuery) {
    // jQuery is already there.
    console.log('jQuery version (Wiki) = ' + $.fn.jquery);
} else {
    // Start to load jQuery and wait until loaded
    loadScript(jQuery_url, waitfor_jquery(jQueryLoaded));
}

// ***************************** load CSS *********************************** 
// https://stackoverflow.com/questions/17666785/check-external-stylesheet-has-loaded-for-fallback
// https://www.phpied.com/when-is-a-stylesheet-really-loaded/
function appendStyleSheet(task, errorFunc, successFunc, fallback) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    if (fallback){
        link.href = task.fallback;
    } else {
        link.href = task.source;
    }
    link.onerror = errorFunc;
    // https://www.w3schools.com/tags/ev_onload.asp
    link.onload = function () {
        console.log(url + ' successfully loaded.');
        successFunc(task);
    };
    document.getElementsByTagName("head")[0].appendChild(link);
    console.log(url + ' appended to "head", but not yet loaded.');
}

function appendStyleSheetOrFallback(task, errorFunc, successFunc) {
    // prepare for fallback
    var firstError = function () {
        if (task.fallback == null) {
            errorFunc(task);
        } else {
            // second try: fallback = true
            appendStyleSheet(task, errorFunc, successFunc, true);
        }
    }
    // first try: fallback = false
    appendStyleSheet(task, firstError, successFunc, false);
}

function appendScript(task, errorFunc, successFunc, fallback) {
    if (fallback){
        var url = task.fallback;
    } else {
        var url = task.source;
    }
   $.getScript(url)
        .done(function (script, textStatus) {
            console.log(url + ' successfully loaded.');
            successFunc(task);
        })
        .fail(function (jqxhr, settings, exception) {
            errorFunc(task);
        });
}

function appendScriptOrFallback(task, errorFunc, successFunc) {
    // prepare for fallback
    var firstError = function () {
        if (task.fallback == null) {
            errorFunc(task);
        } else {
            // second try: fallback = true
            appendScript(task, errorFunc, successFunc, true);
        }
    }
    // first try: fallback = false
    appendScript(task, firstError, successFunc, false);
}

function appendScriptOrStyleSheet(task, errorFunc, successFunc) {
    if (task.css == true) {
        appendStyleSheetOrFallback(task, errorFunc, successFunc);
    } else {
        appendScriptOrFallback(task, errorFunc, successFunc);
    }
}

function state(){
    liblist.forEach(function(taskname){
        var t = tasks[taskname];
        console.log(taskname + ': ' + t.state+ ' ' + t.name);
    }); 
}

function errorFunc(task){
    console.log('Error in ' + task.name);
    console.log(task);
}

function successFunc(task){
    console.log('Success in ' + task.name);
    console.log(task);
}

function jQueryLoaded() {
    console.log('jQuery loaded. Continue...');
    liblist.forEach(function(taskname){
        tasks[taskname].state = 'wait for load';
    }); 
    state();
    liblist.forEach(function(taskname){
        tasks[taskname].state = 'wait for load';
    }); 
    liblist.forEach(function(taskname){
        tasks[taskname].state = 'pending';
        var t = tasks[taskname];
        appendScriptOrStyleSheet(t, errorFunc(t), successFunc(t)); 
    }); 
}