import preparePage, {
    mathQuillify
} from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";

var lang;
var isH5P = ((typeof H5P) !== 'undefined');
console.log('isH5P = ' + isH5P);
if (isH5P) {
    // eslint-disable-next-line no-undef
    lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('preparePageEvent received');
        preparePage();
    });
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('mathquillifyEvent', function (ev, id) {
        mathQuillify(id);
    });
    console.info('H5P listening to preparePageEvent');
} else {
    lang = getCookie('lang');
    if (lang == null || lang == 'null') {
        lang = 'de';
    }
    preparePage();
}
// console.log('formulaAppletLanguage.set ' + lang);
formulaAppletLanguage.set(lang);
// This information is used by preparePage.js and translate.js/clickLanguage()