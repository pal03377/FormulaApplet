export let domLoad = new Promise(function waitForDomThenResolve(resolve) { // reject weggelassen, weil es beim DOM Load ohnehin nie Fehler geben sollte
    if (document.readyState !== "loading") {
        // Das DOM ist schon geladen, wir können direkt resolve-n - siehe https://stackoverflow.com/q/39993676
        resolve();
    } else {
        document.addEventListener("DOMContentLoaded", resolve); // resolve-n, sobald das Event feuert
    }
});

export function findDoc() {
    var win;
    try {
        var win2 = window.frames[2].frames[0];
        if (typeof win2 == 'undefined') {
            win = window;
         } else {
            win2.name = '>>> Editor Window <<<'; 
            win = win2;
            win2 = null;
        }
    } catch (error) {
        window.name = '>>> Main Window <<<';
        win = window;
    }
    // console.log('dom.js: win.name=' + win.name);
    return win.document;
};

export function isH5P() {
    var h5p_classes = document.getElementsByClassName('h5p-content');
    var isH5P = (h5p_classes.length > 0);
    // console.log('dom.js: isH5P = ' + isH5P);
    // console.log('dom.js: window.name = ' + window.name);
    return isH5P; //publish
}