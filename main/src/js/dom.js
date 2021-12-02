import $ from "jquery";

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
        var frameList = window.frames;
        var found = false;
        var frm;
        for (var i = 0; i < frameList.length; i += 1) {
            frm = frameList[i];
            if ($(frm.frameElement).hasClass('overlay-active')) {
                found = true;
                i = frameList.length; //short circuit
            }
        }
        if (found) {
            frameList = frm.frames;
            found = false;
            for (i = 0; i < frameList.length; i += 1) {
                frm = frameList[i];
                if ($(frm.frameElement).hasClass('h5p-editor-iframe')) {
                    found = true;
                    i = frameList.length; //short circuit
                }
            }
        }
        if (found) {
            win = frm;
            win.name = '>>> Editor Window <<<';
        } else {
            window.name = '>>> Main Window <<<';
            win = window;
        }
    } catch (error) {
        win = window;
        win.name = '>>> Error Window <<<';
    }
    // console.log(win.name);
    return win.document;
}

export function isH5P() {
    var h5p_classes = document.getElementsByClassName('h5p-content');
    var isH5P = (h5p_classes.length > 0);
    return isH5P; //publish
}