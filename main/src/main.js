import preparePage from "./js/preparePage.js";
var typeofH5P = (typeof H5P);
console.log('main: typeofH5P=' + typeofH5P);
if (typeofH5P == 'undefined') {
    console.log('H5P undefined');
    preparePage();
} else {
    // console.log(document.URL);
    H5P.jQuery(document).on('preparePageEvent', function () {
        console.log('preparePageEvent received');
        preparePage();
    });
    console.log('H5P listening to preparePageEvent');
}
