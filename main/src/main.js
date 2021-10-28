// import $ from "jquery";
import preparePage, {
    mathQuillifyAll,
    mathQuillify
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";

window.onload = function () {
    // make sensitive for mathquillifyEvent(id)
    // formulaapplet.js: function afterAppend(id) fires mathquillifyEvent (one per applet)

    // document.addEventListener('mathquillifyEvent', function (ev) {
    //     console.log('main: receive mathquillifyEvent ' + ev);
    // });

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
        console.log('main.js: receive setInputEvent');
    });
    console.log('main.js: watch setInputEvent');


    var lang;
    if (isH5P) {

        // // eslint-disable-next-line no-undef
        // H5P.jQuery(document).on('setInputEvent', function (_ev, id) {
        //     console.log('main.js: receive setInputEvent');
        // });

        // make sensitive for preparePageEvent
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('preparePageEvent', function () {
            console.info('preparePageEvent received');
            preparePage();
        });
        // eslint-disable-next-line no-undef
        H5P.jQuery(document).on('mathquillifyEvent', function (_ev, id) {
            mathQuillify(id);
        });
        // eslint-disable-next-line no-undef
        // H5P.jQuery(document).on('setInputEvent', function (_ev, id) {
        //     console.log('main.js: setInputEvent received');
        // });

        console.info('H5P listening to preparePageEvent and mathquillifyEvent(id)');
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
};