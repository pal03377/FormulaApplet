import preparePage from "./js/preparePage.js";
import {
    formulaAppletLanguage,
    getCookie
} from "./js/translate.js";
var lang;
var typeofH5P = (typeof H5P);
if (typeofH5P == 'undefined') {
    console.info('no H5P');
    lang = getCookie('lang') || 'de';
    preparePage();
} else {
    // eslint-disable-next-line no-undef
    lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('preparePageEvent received');
        preparePage();
    });
    console.info('H5P listening to preparePageEvent');
}
console.log('formulaAppletLanguage.set ' + lang);
formulaAppletLanguage.set(lang);
// This information is used by preparePage.js and translate.js/clickLanguage()