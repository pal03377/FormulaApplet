console.log('here is fa.js');
/*
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    //
    paths: {
        app: '../app'
    }
});
*/

// https://requirejs.org/docs/api.html#pathsfallbacks
requirejs.config({
    //To get timely, correct error triggers in IE, force a define/shim exports check.
    enforceDefine: true,
    paths: {
        jquery: [
                /*
                <script
                src="https://code.jquery.com/jquery-3.4.1.min.js"
                integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
                crossorigin="anonymous"></script>
             'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min',
               */
            'https://code.jquery.com/jquery-3.4.1.min.js',

            //If the CDN location fails, load from this location
            'lib/jquery-3.4.1.min.js'
        ]
    }
});


// Start the main app logic.
requirejs(['jquery', 'canvas', 'app/sub'],
function   ($,        canvas,   sub) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});