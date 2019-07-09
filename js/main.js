//console.log( 'Here is main.js' );

function loader_log( logger, message, state){
  var d = new Date(), ts;
  ts = d.toLocaleTimeString().split(' ');
  //console.log(ts);
  ts = ts[0] + '.' + d.getMilliseconds() + ' ';
  message = ts + message;
  if( state == 'error'){
    message += ' <span style="color:red">ERROR</span>'
  }
  if( state == 'ok'){
    message += ' <span style="background:lightgrey; color:green">OK</span>'
  }
  logger.innerHTML += '</br>' + message;
}

out_log = document.getElementById( 'load_logger');
loader_log(out_log, 'main.js loaded.', 'ok');

function load_lib_or_fallback(load_url, fallback, after_fn){
  loadjs([load_url], {returnPromise: true})
  .then(function() { loader_log( out_log, load_url + ' loaded', 'ok' ); after_fn() })
  .catch(function(pathsNotFound) { 
    loader_log( out_log, 'Error loading ' + load_url, 'error' );
      loadjs([fallback], {returnPromise: true})
        .then(function() { loader_log( out_log, fallback + ' (local) loaded', 'ok' ); after_fn() })
        .catch(function(pathsNotFound) { loader_log( out_log, 'Error loading ' + fallback + ' (local)', 'error' ) });
    });
}

load_lib_or_fallback('https://code.jquery.com/jquery-3.4.1.min.js', '/js/lib/jquery-3.4.1.min.js', load_2)  // MathQuill needs jQuery 1.5.2+
// mathquill: local lib from https://github.com/mathquill/mathquill/releases/download/v0.10.1/mathquill-0.10.1.zip (NOT source, lacks of mathquill.js)

function load_2(){
  load_lib_or_fallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css', '/js/lib/mathquill-0.10.1/mathquill.css', function(){});
  load_lib_or_fallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js', '/js/lib/mathquill-0.10.1/mathquill.js', load_3);
}

function load_3(){
  load_lib_or_fallback('http://algebrite.org/dist/1.2.0/algebrite.bundle-for-browser.js', '/js/lib/Algebrite/dist/algebrite.bundle-for-browser.js', load_4)  // MathQuill needs jQuery 1.5.2+
}

function load_4(){
  loader_log(out_log, 'Loading finished.', '');
}
