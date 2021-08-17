let domLoadResolve;
export let domLoad = new Promise(resolve => domLoadResolve = resolve);

document.addEventListener("DOMContentLoaded", domLoadResolve);