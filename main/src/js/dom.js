import $ from "jquery";

export let domLoad = new Promise(function waitForDomThenResolve(resolve) { // reject weggelassen, weil es beim DOM Load ohnehin nie Fehler geben sollte
    if (document.readyState !== "loading") {
        // Das DOM ist schon geladen, wir können direkt resolve-n - siehe https://stackoverflow.com/q/39993676
        resolve();
    } else {
        document.addEventListener("DOMContentLoaded", resolve); // resolve-n, sobald das Event feuert
    }
});

// export function findDoc() {  //finally seen as not necessary
//     return document;
// }

// function findDoc_bak() {
//     var win, message;
//     if (isH5P()) {
//         try {
//             var frameList = window.frames;
//             var found = false;
//             for (var i = 0; i < frameList.length; i += 1) {
//                 win = frameList[i];
//                 // console.log(frm);
//                 if ($(win.frameElement).hasClass('overlay-active')) {
//                     found = true;
//                     i = frameList.length; //short circuit
//                 }
//             }
//             if (found) {
//                 frameList = win.frames;
//                 found = false;
//                 for (i = 0; i < frameList.length; i += 1) {
//                     win = frameList[i];
//                     // console.log(frm);
//                     if ($(win.frameElement).hasClass('h5p-editor-iframe')) {
//                         found = true;
//                         i = frameList.length; //short circuit
//                     }
//                 }
//             }
//             if (found) {
//                 win.name = '>>> Editor Window <<<';
//                 message = '>>> Editor window';
//                 // console.log(win);
//             } else {
//                 window.name = '>>> Main Window <<<';
//                 message = '>>> Main window';
//                 win = window;
//             }
//         } catch (error) {
//             win = window;
//             win.name = '>>> Error Window <<<';
//             message = '>>> ERROR in seeking Editor window';
//         }
//     } else {
//         win = window;
//         message = '>>> No H5P window';
//     }
//     // console.log(win.name);
//     console.log(message);
//     return win.document;
// }

export function isH5P() {
    return ((typeof window.H5P) !== 'undefined');
}