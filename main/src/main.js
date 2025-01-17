// import $ from "jquery";
import preparePage, {
    mathQuillifyAll,
    mathQuillify,
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";
import {
    isH5P
} from "./js/dom.js";
import {
    randomId,
    editorMessageHandler
} from "./js/editor.js";
import decode from "./js/decode.js";

// H5Pbridge
export {
    preparePage,
    mathQuillify,
    randomId,
    decode,
    editorMessageHandler
};

// debugger;

window.onload = function () {
    var lang;
    if (isH5P()) {
        // eslint-disable-next-line no-undef, no-unused-vars
        H5P.jQuery(document).on('mathquillifyAllEvent', function (_ev) {
            mathQuillifyAll();
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyEvent', function (_ev, id) {
            mathQuillify(id);
        });

        // window.addEventListener('message', handleMessage, false); //bubbling phase
        // TODO this code causes bugs:
        // eslint-disable-next-line no-undef
        lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
    } else {
        //no H5P
        lang = getCookie('lang');
        if (lang == null || lang == 'null') {
            lang = 'de';
        }
        // no event necessary
        // mathQuillifyAll(); is included in preparePage()
        preparePage();
    }
    console.log('formulaAppletLanguage.set ' + lang);
    formulaAppletLanguage.set(lang);
    // This information is used by preparePage.js and translate.js/clickLanguage()
};

// function handleMessage(event) {
//     // create echo
//     if (event.data == 'SignalToMainEvent') {
//         event.target.postMessage('echoFromMainEvent', event.origin);
//     }
// }

// export function randomId(length) {
//     var result = 'fa';
//     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789____----';
//     var numOfChars = characters.length;
//     for (var i = 2; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * numOfChars));
//     }
//     // result = '"' + result + '"';
//     return result;
// }

export function mainIsLoaded() {
    return true;
}