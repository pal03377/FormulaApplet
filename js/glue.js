var libPath = 'js/lib/';

var paths = {};
paths.mathquillcss = {
	path: 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css',
	fallback: libPath + 'mathquill-0.10.1/mathquill.css',
	css: true,
	next: 'end'
};
paths.mathquill = {
	path: 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js',
	fallback: libPath + 'mathquill-0.10.1/mathquill.js',
	css: false,
	next: 'end'
};
paths.algebrite = {
	path: 'http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js',
	fallback: libPath + 'Algebrite/dist/algebrite.bundle-for-browser.js',
	css: false,
	next: 'end'
};

for (var i = 0; i < liblist.length - 1; i++) {
	paths[liblist[i]].next = liblist[i + 1];
}
// console.log(paths);
// console.log(liblist);

var libLoaderReady = false;

waitfor_jquery_and_if_ready_then_do(function () {
	console.log('jQuery version = ' + $.fn.jquery);
	// Start loading. Recursive!
	getScriptOrFallback(liblist[0]);
});

// *************************************************************************
// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
function waitfor_jquery_and_if_ready_then_do(jquery_ready) {
	// console.log( 'window.jQuery =' + window.jQuery);
	if (window.jQuery) {
		console.log('jQuery is available');
		jquery_ready();
	} else {
		console.log('Waiting for jQuery...');
		setTimeout(function () {
			waitfor_jquery_and_if_ready_then_do(jquery_ready)
		}, 50);
	}
}

// ***************************** load CSS *********************************** 
// https://stackoverflow.com/questions/17666785/check-external-stylesheet-has-loaded-for-fallback
// https://www.phpied.com/when-is-a-stylesheet-really-loaded/
function appendStyleSheet(url, errorFunc, nexttask) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	link.onerror = errorFunc;
	// https://www.w3schools.com/tags/ev_onload.asp
	link.onload = function () {
		console.log(url + ' successfully loaded.');
		getScriptOrFallback(nexttask);
	};
	document.getElementsByTagName("head")[0].appendChild(link);
	console.log(url + ' appended to "head", but not yet loaded.');
}

// load javaScript or CSS
function getScriptOrFallback(task) {
	console.log('Start loading: ' + task);
	if (task === 'end') {
		return;
	} else {
		var scriptUrl = paths[task].path;
		var fallbackUrl = paths[task].fallback;
		var nexttask = paths[task].next;
		var isCSS = paths[task].css
		if (isCSS) {
			appendStyleSheet(scriptUrl, function () {
				console.log('Error loading ' + scriptUrl + ' - Try fallback.');
				// fallback
				appendStyleSheet(fallbackUrl, function () {
					console.log('Error loading ' + css_lib_2 + ' No fallback - Give up.');
				});
			}, nexttask);
		} else {
			$.getScript(scriptUrl)
				.done(function (script, textStatus) {
					console.log(scriptUrl + ' successfully loaded.');
					// load_next_script;
					getScriptOrFallback(nexttask);
				})
				.fail(function (jqxhr, settings, exception) {
					// console.log( exception );
					// fallback
					$.getScript(fallbackUrl)
						.done(function (script, textStatus) {
							console.log('Fallback: ' + fallbackUrl + ' successfully loaded.');
							// load_next_script;
							getScriptOrFallback(nexttask);
						})
						.fail(function (jqxhr, settings, exception) {
							// console.log( exception );
						});
				});
		}
	}
};

/** DEPRECATED
function start_loading() {
	getScriptOrFallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js',
		libPath + 'mathquill-0.10.1/mathquill.js',
		function () {
			continue_loading_1();
			init();
		})
};

function continue_loading_1() {
	getScriptOrFallback('http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js',
		libPath + 'Algebrite/dist/algebrite.bundle-for-browser.js', continue_loading_2())
};

function continue_loading_2() {
	console.log('Started all library loading requests.');
};

// start_loading();
*/
$(document).ready(function () {
	console.log("Document ready.");
	libLoaderReady = true;
	// check_css();
});