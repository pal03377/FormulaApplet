function key() {
    this.id = '';
    this.html5 = '';
    this.mathquill = '';
}

// function create_key(keylist, id, html5, mathquill) {
//     var k = new key();
//     k.id = id;
//     k.html5 = html5;
//     k.mathquill = mathquill;
//     keylist.append(k);
// }

var squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';

var keys_mixed = [
    // row 0
    [
        ['x'],
        ['y'],
        ['z'],
        ['pi', '&pi;', '\\pi'],
        ['smallgap-0', '', ''],
        ['7'],
        ['8'],
        ['9'],
        ['times', '&times;', '\\cdot'],
        ['divided', '&divide;', '/']
    ],
    // row 1
    [
        ['a'],
        ['nth_root', '|\u2b1a|', '\\nthroot'],
        ['nth_root', 'log<sub><small>\u2b1a</small></sub>', '\\nthroot'],
        ['nth_root', '\u2b1a<sub><small>\u2b1a</small></sub>', '\\nthroot'],
        ['smallgap-1', '', ''],
        ['4'],
        ['5'],
        ['6'],
        ['plus', '+', '+'],
        ['minus', '-', '-']
    ],
    // row 2
    [
        ['d', 'e<sup><small>\u2b1a</small></sup>'],
        ['return2', '\u2b1a<sup>\u2b1a</sup>', 'return2'],
        ['return2', '\u2b1a<sup><small>2</small></sup>', 'return2'],
        // ['nth_root', '\u221a', '\\nthroot'],
        ['nth_root', '<sup id="sup_root">\u2b1a</sup>' + squareroot, 'cmd-squareroot'],
        ['smallgap-2', '', ''],
        ['1'],
        ['2'],
        ['3'],
        ['equal', '=', '='],
        ['backspace', '\u232B', 'cmd-backspace']
    ],
    // row 3
    [
        ['e', '10<sup><small>\u2b1a</small></sup>'],
        ['return', '<span style="width: 200%">\u21b5</span>', 'return'],
        ['return2', '\u23ce', 'return2'],
        ['nth_root', squareroot, 'cmd-squareroot'],
        ['smallgap-2', '', ''],
        ['0'],
        ['.'],
        [','],
        ['equal', '=', '='],
        ['backspace', '⇐', 'cmd-backspace']
    ],
]

function create_vkbd(key_array) {
    var result = '<div id="vkbd_"><table>\r\n';
    result += '<caption id="vkbd_header">Move</caption>\r\n';
    for (var rows = 0; rows < key_array.length; rows++) {
        var row = key_array[rows];
        result += '<tr>\r\n';
        for (var keyindex = 0; keyindex < row.length; keyindex++) {
            var key = row[keyindex];
            if (typeof key[1] == 'undefined') {
                key[1] = key[0];
            }
            if (typeof key[2] == 'undefined') {
                key[2] = key[0];
            }
            var cl = 'vkbd';
            if (key[0].startsWith('smallgap')) {
                cl += ' smallgap';
            }
            result += '<td class="' + cl + '" id="vkbd-' + key[0] + '" cmd="';
            result += key[2] + '">' + key[1] + '</td>\r\n';
            // console.log('vkbd-' + key[0] + ' ' + key[1] + ' cmd-' + key[2]);
        }
        result += '</tr>\r\n';
        // console.log(row);
    }
    result += '</table></div>\r\n';
    return result;
}

function dragElement(elmnt) {
    var deltaX = 0,
        deltaY = 0,
        posX_old = 0,
        posY_old = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        console.log(e);
        e.preventDefault();
        // get the mouse cursor position at startup:
        if (e.type == 'touchstart') {
            e = e.touches[0];
        }
        posX_old = e.clientX;
        posY_old = e.clientY;
        console.log(posX_old + ' ' + posY_old);
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        if (e.type == 'touchmove') {
            e = e.touches[0];
        } else {
            e.preventDefault();
        }

        // calculate the new cursor position:
        deltaX = e.clientX - posX_old;
        deltaY = e.clientY - posY_old;
        posX_old = e.clientX;
        posY_old = e.clientY;
        console.log(deltaX + ' ' + deltaY);
        // set the element's new position:
        elmnt.style.left = (elmnt.offsetLeft + deltaX) + "px";
        elmnt.style.top = (elmnt.offsetTop + deltaY) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

var vkbdLoaded = true;