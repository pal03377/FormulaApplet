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
    document.addEventListener('mathquillifyEvent', function (ev) {
        console.log('receive mathquillifyEvent ' + ev);
    });
    // mathQuillify(id);

    var h5p_classes = document.getElementsByClassName('h5p-content');
    var isH5P = (h5p_classes.length > 0);
    console.log('*** isH5P = ' + isH5P);

    var lang;
    if (isH5P) {
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