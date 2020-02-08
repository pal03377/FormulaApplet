function loadScript( scriptName ){
   scriptName = libPath + '/KAS/' + scriptName; 
   $.getScript( scriptName )
    .done(function (script, textStatus) {
        console.log(scriptName + ' successfully loaded.');
    })
    .fail(function (jqxhr, settings, exception) {
        console.log(scriptName + ': ' + exception );
    });
}

function loadKAS(){
    loadScript( './underscore.js' );
    loadScript( 'parser.js' );
    loadScript( 'nodes.js' );
    loadScript( 'compare.js' );
}

loadKAS();
