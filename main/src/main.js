import preparePage from "./js/preparePage.js";
import {getCookie} from "./js/translate.js";
var typeofH5P = (typeof H5P);
if (typeofH5P == 'undefined') {
    console.info('no H5P');
    var lang = getCookie('lang') || 'de';
    preparePage(lang);
} else {
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('preparePageEvent received');
        var lang = H5P.jQuery('html')[0].getAttribute('xml:lang');
        preparePage(lang);
    });
    console.info('H5P listening to preparePageEvent');
}
