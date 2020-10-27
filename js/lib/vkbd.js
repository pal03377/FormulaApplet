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
        ['abs', '|\u2b1a|'],
        ['log_base', 'log<sub><small>\u2b1a</small></sub>'],
        ['subscript', '\u2b1a<sub><small>\u2b1a</small></sub>'],
        ['smallgap-1', '', ''],
        ['4'],
        ['5'],
        ['6'],
        ['plus', '+', '+'],
        ['minus', '-', '-']
    ],
    // row 2
    [
        ['exp', 'e<sup><small>\u2b1a</small></sup>'],
        ['power', '\u2b1a<sup>\u2b1a</sup>'],
        ['square', '\u2b1a<sup><small>2</small></sup>'],
        // ['nth_root', '\u221a', '\\nthroot'],
        ['nth_root', '<sup id="sup_root">\u2b1a</sup>' + squareroot],
        ['smallgap-2', '', ''],
        ['1'],
        ['2'],
        ['3'],
        ['backspace', '\u232B'],
    ],
    // row 3
    [
        ['power_of_ten', '10<sup><small>\u2b1a</small></sup>'],
        ['enter', '<span style="width: 200%">\u21b5</span>', 'enter'],
        ['enter2', '\u23ce', 'enter2'],
        ['squareroot', squareroot],
        ['smallgap-2', '', ''],
        ['0'],
        ['.'],
        [','],
        ['equal2', '=', '='],
        ['backspace', '⇐', 'backspace']
    ]
]

var keys_abc = [
    // row 0
    [
        ['q'],
        ['w'],
        ['e'],
        ['r'],
        ['t'],
        ['z'],
        ['u'],
        ['i'],
        ['o'],
        ['p'],
        ['ue', '&uuml;'],
    ],
    // row 1
    [
        ['a'],
        ['s'],
        ['d'],
        ['f'],
        ['g'],
        ['h'],
        ['j'],
        ['k'],
        ['l'],
        ['oe', '&ouml;'],
        ['ae', '&ouml;'],
    ],
    // row 2
    [
        // https://www.w3schools.com/charsets/ref_utf_arrows.asp
        ['shift', '⇑'],
        ['y'],
        ['x'],
        ['c'],
        ['v'],
        ['b'],
        ['n'],
        ['smallgap-0', '', ''],
        ['smallgap-1', '', ''],
        ['backspace', '\u232B'],
    ],
    // row 3
    [
        ['smallgap-2', '', ''],
        ['smallgap-3', '', ''],
        ['point', '.'],
        ['space', ' '],
        ['left', '←'],
        ['right', '→'],
        ['enter', '<span style="width: 200%">\u21b5</span>', 'enter'],
    ]
]

function get_vkbd() {
    var result = '<div id="vkbd">\r\n';
    result += '  <div id="vkbd_header">Move</div>\r\n';
    result += '  <div class="vkbd_tab"\r\n>';
    result += '      <button class="tablinks" id="button-table_mixed" onclick="tabClick(event, \'table_mixed\')">123&radic;+-&nbsp;&nbsp;&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_abc" onclick="tabClick(event, \'table_abc\')">abc</button>\r\n';
    result += '      <button class="tablinks" id="button-table_greek" onclick="tabClick(event, \'kommt_noch\')">&alpha;&beta;&gamma;</button>\r\n';
    result += '  </div>\r\n';

    result += create_table(keys_abc, 'table_abc');
    result += create_table(keys_mixed, 'table_mixed');
    result += '</div>\r\n';
    return result;
}

function create_table(key_array, table_id) {
    var result = '<table id="' + table_id + '">\r\n';
    result += '<tbody>\r\n';
    for (var row_number = 0; row_number < key_array.length; row_number++) {
        var keylist = key_array[row_number];
        result += '<tr class="vkbd-row' + row_number + '">\r\n';
        // console.log( '<tr class="vkbd-row' + row_number + '">\r\n' );
        // result += '<tr>\r\n';
        for (var keyindex = 0; keyindex < keylist.length; keyindex++) {
            var key = keylist[keyindex];
            if (typeof key[1] == 'undefined') {
                key[1] = key[0];
            }
            if (typeof key[2] == 'undefined') {
                key[2] = key[0];
            }
            var cl = 'vkbd_button';
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
    result += '</tbody>\r\n';
    result += '</table>\r\n';
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
        // console.log(e);
        e.preventDefault();
        // get the mouse cursor position at startup:
        if (e.type == 'touchstart') {
            e = e.touches[0];
        }
        posX_old = e.clientX;
        posY_old = e.clientY;
        // console.log(posX_old + ' ' + posY_old);
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
        // console.log(deltaX + ' ' + deltaY);
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