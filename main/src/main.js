import $ from "jquery";
import preparePage, {
    mathQuillifyAll,
    mathQuillify
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";

// define global variable. Ugly but necessary.
// var document.main_loaded = false;
// localStorage.setItem('mainIsLoaded', 'false');
// $('body').attr('mainIsLoaded', 'false');
window.mainIsLoaded = 0;

window.onload = function () {
    var h5p_classes = document.getElementsByClassName('h5p-content');
    var isH5P = (h5p_classes.length > 0);
    console.log('main: isH5P = ' + isH5P);

    // eslint-disable-next-line no-unused-vars
    // $(document).on('setInputEvent', function (ev) {
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-unused-vars
    // $(document).on('setInputEvent', function (ev) {
    //     console.log('editor.js: receive setInputEvent');
    //     // ev.preventDefault();
    //     // setInput(editorMf);
    // });

    // https://blog.logrocket.com/custom-events-in-javascript-a-complete-guide/
    document.addEventListener('setInputEvent', function (ev) {
        console.log(ev);
        // var d = ev.data;
        console.log('RECEIVE setInputEvent (main.js)');
    });
    console.log('LISTEN setInputEvent (main.js)');


    var lang;
    if (isH5P) {

        // // eslint-disable-next-line no-undef
        // H5P.jQuery(document).on('setInputEvent', function (_ev, id) {
        //     console.log('main.js: receive setInputEvent');
        // });

        // make sensitive for preparePageEvent
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('preparePageEvent', function () {
            console.info('RECEIVE preparePageEvent');
            preparePage();
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyEvent', function (_ev, id) {
            // console.info('RECEIVE mathquillifyEvent(id) (main.js)' + id);
            mathQuillify(id);
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyAllEvent', function (_ev) {
            console.info('RECEIVE mathquillifyAllEvent (main.js)');
            mathQuillifyAll();
        });
    
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
        mathQuillifyAll();
        preparePage();
    }
    console.log('formulaAppletLanguage.set ' + lang);
    formulaAppletLanguage.set(lang);
    // This information is used by preparePage.js and translate.js/clickLanguage()

    // console.log('mainIsLoaded = true');
    // every time main is called, window.mainIsLoaded is increased by 1
    // The first time main is loaded, window.mainIsLoaded will be 1.
    window.mainIsLoaded += 1;
};