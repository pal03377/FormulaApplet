var libPath = 'js/lib/';

// TODO fallback for jquery (maybe in header.php)
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

// $liblist is set in *.php file as a php variable
// header.php converts it to a javascript variable
for (var i = 0; i < liblist.length - 1; i++) {
	paths[liblist[i]].next = liblist[i + 1];
}

var libLoaderReady = false;

waitfor_jquery_and_if_ready_then_do(function () {
	console.log('jQuery version = ' + $.fn.jquery);
	// Start loading. Recursive!
	getScriptOrFallback(liblist[0]); // start chain
});

// ***** waiter functions *****************************************
// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
function waitfor_jquery_and_if_ready_then_do(jquery_ready) {
	// console.log( 'window.jQuery =' + window.jQuery);
	if (window.jQuery) {
		// console.log('jQuery is available');
		jquery_ready();
	} else {
		console.log('Waiting for jQuery...');
		setTimeout(function () {
			waitfor_jquery_and_if_ready_then_do(jquery_ready)
		}, 50);
	}
}

function waitfor_libLoader_and_if_ready_then_do(ll_ready) {
	if (libLoaderReady == true) {
		console.log('libLoader ready.');
		ll_ready();
	} else {
		console.log('waiting for libLoader...');
		setTimeout(function () {
			waitfor_libLoader_and_if_ready_then_do(ll_ready)
		}, 50);
	}
}

$(document).ready(function () {
	console.log("Document ready.");
	libLoaderReady = true;
});

function waitfor_mathquill_and_if_ready_then_do(mq_ready) {
	// console.log( typeof MathQuill );
	if ((typeof MathQuill) === "undefined") {
		console.log('waiting for MathQuill...');
		setTimeout(function () {
			waitfor_mathquill_and_if_ready_then_do(mq_ready)
		}, 50);
	} else {
		console.log('MathQuill ready......');
		mq_ready();
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