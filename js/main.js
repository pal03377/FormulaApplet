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
// loader_log( out_log, 'bli', 'dummy');
// loader_log( out_log, 'bla', 'error');
// loader_log( out_log, 'blu', 'ok');

function load_lib_or_fallback(load_url, fallback){
  loadjs([load_url], {returnPromise: true})
  .then(function() { loader_log( out_log, load_url + 'loaded', 'ok' ) })
  .catch(function(pathsNotFound) { 
    loader_log( out_log, 'Error loading ' + load_url, 'error' );
      loadjs([fallback], {returnPromise: true})
        .then(function() { loader_log( out_log, fallback + ' (local) loaded', 'ok' ) })
        .catch(function(pathsNotFound) { loader_log( out_log, 'Error loading ' + fallback + ' (local)', 'error' ) });
    });
}

load_lib_or_fallback('https://code.jquery.com/jqueryx-3.4.1.min.js', '/js/lib/jquery-3.4.1.min.js')
