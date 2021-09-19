import preparePage from "./js/preparePage.js";
var typeofH5P = (typeof H5P);
if (typeofH5P == 'undefined') {
    console.info('no H5P');
    preparePage();
} else {
    // eslint-disable-next-line no-undef
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.info('preparePageEvent received');
        preparePage();
    });
    console.info('H5P listening to preparePageEvent');
}
