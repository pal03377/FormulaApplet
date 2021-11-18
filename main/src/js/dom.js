export let domLoad = new Promise(function waitForDomThenResolve(resolve) { // reject weggelassen, weil es beim DOM Load ohnehin nie Fehler geben sollte
    if (document.readyState !== "loading") {
        // Das DOM ist schon geladen, wir können direkt resolve-n - siehe https://stackoverflow.com/q/39993676
        resolve();
    } else {
        document.addEventListener("DOMContentLoaded", resolve); // resolve-n, sobald das Event feuert
    }
});

export function findDoc(){
    var doc;
    try {
        var doc2 = window.frames[2].frames[0].document;
        if (typeof doc2 == 'undefined') {
            doc = document;
        } else {
            doc = doc2;
            doc2 = null;
        }
    } catch (error) {
        doc = document;
    }
    return doc;
};