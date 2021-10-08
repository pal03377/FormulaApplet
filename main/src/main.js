import preparePage, {
    mathQuillify
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";

var lang;
console.log(typeof H5P);
var isH5P = ((typeof H5P) !== 'undefined');
console.log('isH5P = ' + isH5P);
if (isH5P) {
    //cheat for eslint
    var H5P = H5P || {};
    lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('preparePageEvent received');
        preparePage();
    });
    H5P.jQuery(document).on('mathquillifyEvent', function (ev, id) {
        mathQuillify(id);
    });
    console.info('H5P listening to preparePageEvent and mathquillifyEvent');
} else {
    lang = getCookie('lang');
    if (lang == null || lang == 'null') {
        lang = 'de';
    }
    preparePage(isH5P);
}
console.log('formulaAppletLanguage.set ' + lang);
formulaAppletLanguage.set(lang);
// This information is used by preparePage.js and translate.js/clickLanguage()