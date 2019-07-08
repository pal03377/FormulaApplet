console.log( 'Here is main.js' );
loadjs(['https://code.jquery.com/jqueryx-3.4.1.min.js'], {returnPromise: true})
  .then(function() { console.log( 'Here is jQuery' ) })
  .catch(function(pathsNotFound) { 
      console.log( 'Could not load jQuery' );
      loadjs(['/js/lib/jquery-3.4.1.min.js'], {returnPromise: true})
        .then(function() { console.log( 'Here is jQuery (local)' ) })
        .catch(function(pathsNotFound) { console.log( 'Could not load jQuery (local)' ) });
    });