// https://requirejs.org/docs/api.html#jsfiles

requirejs.config({
    //To get timely, correct error triggers in IE, force a define/shim exports check.
    //enforceDefine: true,
    paths: {
        jquery: [
            'https://code.jquery.com/jquery-3.4.1.min',
            //If the CDN location fails, load from this location
            '/js/lib/jquery-3.4.1.min'
        ], 
        mathquill: [
            'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill',
            //If the CDN location fails, load from this location
            '/js/lib/mathquill-0.10.1/mathquill'
        ],
        mathquillcss: [
            'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css',
            //If the CDN location fails, load from this location
            '/js/lib/mathquill-0.10.1/mathquill.css'
        ]
    }
});

// Start the main app logic.
require(['jquery'], function ($) {});
require(['mathquill'], function (MQ) {});
require(['mathquillcss'], function (CSS) {});
