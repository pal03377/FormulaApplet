console.log( 'Here is main.js' );

function loader_log( logger, message, state){

  // if...
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

function load_lib_or_fallback(load_url, fallback){
  loadjs([load_url], {returnPromise: true})
  .then(function() { loader_log( out_log, load_url + ' loaded', 'ok' ) })
  .catch(function(pathsNotFound) { 
    loader_log( out_log, 'Error loading ' + load_url, 'error' );
      loadjs([fallback], {returnPromise: true})
        .then(function() { loader_log( out_log, fallback + ' (local) loaded', 'ok' ) })
        .catch(function(pathsNotFound) { loader_log( out_log, 'Error loading ' + fallback + ' (local)', 'error' ) });
    });
}

load_lib_or_fallback('https://code.jquery.com/jquery-3.4.1.min.js', '/js/lib/jquery-3.4.1.min.js')
// MathQuill depends on jQuery 1.5.2+
load_lib_or_fallback('https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.js', '/js/lib/mathquill.js')
//load_lib_or_fallback('https://code.jquery.com/jquery-3.4.1.min.js', '/js/lib/jquery-3.4.1.min.js')
