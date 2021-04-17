// auto_include.js
"use strict";

function test_autoinclude(){
    const result = 'autoinclude ok.';
    document.body.dispatchEvent( new Event('init'));
    return result;
}

export {test_autoinclude};
