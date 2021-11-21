// import $ from "jquery";
import preparePage, {
    mathQuillifyAll,
    mathQuillify
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";
import {
    isH5P
} from "./js/dom.js";
// debugger;

window.onload = function () {
    // var h5p_classes = document.getElementsByClassName('h5p-content');
    // var isH5P = (h5p_classes.length > 0);
    // console.log('main: isH5P = ' + isH5P);
    // console.log('main: window.name = ' + window.name);
    // isH5P_public = isH5P; //publish

    // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
    document.addEventListener('setInputfieldEvent', function (ev) {
        console.log(ev);
        // var d = ev.data;
        console.log('RECEIVE setInputfieldEvent (main.js)');
    });
    console.log('LISTEN setInputfieldEvent (main.js)');

    var lang;
    if (isH5P()) {
        // make sensitive for preparePageEvent
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('preparePageEvent', function () {
            console.info('RECEIVE preparePageEvent');
            preparePage();
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyAllEvent', function (_ev) {
            mathQuillifyAll();
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyEvent', function (_ev, id) {
            // console.info('RECEIVE mathquillifyEvent(id) (main.js)' + id);
            mathQuillify(id);
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('testEvent', function (_ev) {
            console.info('RECEIVE testEvent (main.js)');
        });
        console.info('LISTEN to testEvent (main.js)');

        window.addEventListener('message', handleMessage, false); //bubbling phase
        // window.addEventListener('message', handleMessage, true); //capturing phase
        console.info('LISTEN to message (main.js)');
        console.info('LISTEN to preparePageEvent and mathquillifyEvent(id) (main.js)');
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

    // every time main is called, document.mainIsLoaded is increased by 1
    // The first time main is loaded, document.mainIsLoaded will be 1.
};

// create echo
function handleMessage(event) {
    console.log('message received: ' + event.data);
    if (event.data == 'SignalToMainEvent') {
        console.info('RECEIVE MESSAGE SignalToMainEvent (main.js)');
        // console.log('event.origin = ' + event.origin);
        console.info('POST MESSAGE echoFromMainEvent (main.js)');
        event.target.postMessage('echoFromMainEvent', event.origin);
        // event.target.postMessage('echoFromMainEvent', 'http://localhost/drupal/');
    }
}