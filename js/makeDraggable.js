function makeDraggable(object) {
    // dragElement(document.getElementById("vkbd"));
    // https://hammerjs.github.io/getting-started/
    var mc = new Hammer(object);

    var left_temp = 1;
    var top_temp = 1;
    var left_start = 1;
    var top_start = 1;
    mc.on("panstart panmove", function (ev) {
        if (ev.type == 'panstart') {
            left_start = object.offsetLeft;
            top_start = object.offsetTop;
            left_temp = left_start;
            top_temp = top_start;
        }
        if (ev.type == 'panmove') {
            left_temp = left_start + ev.deltaX;
            top_temp = top_start + ev.deltaY;
            object.style.left = left_temp + 'px';
            object.style.top = top_temp + 'px';
        }
    });
}

export {
    makeDraggable
};