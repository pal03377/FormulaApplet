function key() {
    this.id = '';
    this.html5 = '';
    this.mathquill = '';
}

var squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';
var nth_root = '<sup style="position: relative; top: -0.5em; right: -0.5em;">\u2b1a</sup>' + squareroot;
var enter = '<span style="font-size: 150%; color:green">\u23ce</span>';

var keys_mixed = [
    // row 0
    [
        ['a'],
        ['b'],
        ['c'],
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
        ['x'],
        ['y'],
        ['z'],
        ['e'],
        ['smallgap-1', '', ''],
        ['4'],
        ['5'],
        ['6'],
        ['plus', '+', '+'],
        ['minus', '-', '-']
    ],
    // row 2
    [
        ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>'],
        // ['exp', 'e<sup><small>\u2b1a</small></sup>'],
        ['lg', 'lg'],
        ['power', '\u2b1a<sup>\u2b1a</sup>'],
        // ['nth_root', '<sup id="sup_root">\u2b1a</sup>' + squareroot],
        ['nth_root', nth_root],
        // ['nth_root', '\u221a', '\\nthroot'],
        ['smallgap-2', '', ''],
        ['1'],
        ['2'],
        ['3'],
        ['up', '↑'],
        // ['up', '\uffea'],
        ['backspace', '\u232B'],
        // ['backspace', '⇐', 'backspace']
    ],
    // row 3
    [
        ['bracket-left', '('],
        ['bracket-right', ')'],
        ['square', '\u2b1a<sup style="font-size: 85%">2</sup>'],
        ['squareroot', squareroot],
        ['smallgap-3', '', ''],
        ['0'],
        // ['.'],
        ['comma', ','],
        // ['left', '←'],
        // ['right', '→'],
        ['left', '<span style="font-size: 130%">\u25c5</span>'],
        ['right', '<span style="font-size: 130%">\u25bb</span>'],
        // ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],
        ['enter', enter, 'enter'],
        // ['equal2', '=', '='],
    ]
]

var keys_function = [
    // row 0
    [
        ['sin', '<span style="font-size: 85%">sin</span>'],
        ['cos', '<span style="font-size: 85%">cos</span>'],
        ['tan', '<span style="font-size: 85%">tan</span>'],
        ['smallgap-0', '', ''],
        ['degree', '°'],
        ['minute', '\''],
        ['second', '\'\''],
        ['pi', '&pi;', '\\pi']
    ],
    // row 1
    [
        ['arcsin', '<span style="font-size: 85%">sin<sup>-1</sup></span>'],
        ['arccos', '<span style="font-size: 85%">cos<sup>-1</sup></span>'],
        ['arctan', '<span style="font-size: 85%">tan<sup>-1</sup></span>'],
        ['smallgap-1', '', ''],
        ['abs', '\u2502\u2b1a\u2502'],
        ['subscript', '\u2b1a<sub style="font-size: 85%">\u2b1a</sub>'],
        ['nth_root', nth_root],
        ['infinity', '&infin;'],
    ],
    // row 2
    [
        ['ln'],
        ['lg'],
        ['log_base', 'log<sub style="font-size: 85%">\u2b1a</sub>'],
        ['smallgap-2', '', ''],
        ['bracket-left', '('],
        ['bracket-right', ')'],
        ['up', '↑'],
        ['backspace', '\u232B'],
    ],
    // row 3
    [
        ['exp', 'e<sup style="font-size: 85%">\u2b1a</sup>'],
        ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>'],
        ['power', '\u2b1a<sup>\u2b1a</sup>'],
        ['smallgap-3', '', ''],
        ['squareroot', squareroot],
        ['left', '<span style="font-size: 130%">\u25c5</span>'],
        ['right', '<span style="font-size: 130%">\u25bb</span>'],
        ['enter', enter, 'enter'],
    ],
]

var keys_abc = [
    // row 0
    [
        ['1'],
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9'],
        ['0'],
        ['szlig', '&szlig;'],
    ],
    // row 1
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
        ['ae', '&auml;'],
        ['backspace', '\u232B'],
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
        ['m'],
        ['comma', ','],
        ['up', '↑'],
        ['left', '←'],
        ['right', '→'],
        ['enter', enter, 'enter'],
    ]
]

var keys_ABC = [
    // row 0
    [
        ['1'],
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9'],
        ['0'],
        ['szlig', '&szlig;'],
    ],
    // row 1
    [
        ['Q'],
        ['W'],
        ['E'],
        ['R'],
        ['T'],
        ['Z'],
        ['U'],
        ['I'],
        ['O'],
        ['P'],
        ['UE', '&Uuml;'],
    ],
    // row 1
    [
        ['A'],
        ['S'],
        ['D'],
        ['F'],
        ['G'],
        ['H'],
        ['J'],
        ['K'],
        ['L'],
        ['OE', '&Ouml;'],
        ['AE', '&Auml;'],
        ['backspace', '\u232B'],
    ],
    // row 2
    [
        // https://www.w3schools.com/charsets/ref_utf_arrows.asp
        ['shift', '⇑'],
        ['Y'],
        ['X'],
        ['C'],
        ['V'],
        ['B'],
        ['N'],
        ['M'],
        ['comma', ','],
        ['up', '↑'],
        ['left', '←'],
        ['right', '→'],
        ['enter', enter, 'enter'],
    ]
]

function get_vkbd() {
    var result = '<div id="vkbd">\r\n';
    result += '  <div id="vkbd_header">Move</div>\r\n';
    result += '  <div class="vkbd_tab"\r\n>';
    result += '      <button class="tablinks" id="button-table_mixed" onclick="tabClick(event, \'table_mixed\')">123&radic;+-&nbsp;&nbsp;&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_function" onclick="tabClick(event, \'table_function\')">&nbsp;f(x)&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_abc" onclick="tabClick(event, \'table_abc\')">abc</button>\r\n';
    result += '      <button class="tablinks" id="button-table_ABC" onclick="tabClick(event, \'table_abc_caps\')">ABC</button>\r\n';
    result += '      <button class="tablinks" id="button-table_greek" onclick="tabClick(event, \'kommt_noch\')">&alpha;&beta;&gamma;</button>\r\n';
    result += '  </div>\r\n';

    result += create_table(keys_abc, 'table_abc');
    result += create_table(keys_ABC, 'table_abc_caps');
    result += create_table(keys_mixed, 'table_mixed');
    result += create_table(keys_function, 'table_function');
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
            var cl = 'vkbd_button vkbd-' + key[0];
            if (key[0].startsWith('smallgap')) {
                cl += ' smallgap';
            }
            result += '<td class="' + cl + '" cmd="';
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

function vkbd_bind_events() {
    console.log('Here is vkbd.js');
    $(".vkbd_button").click(function (ev) {
        var cmd = clickEvent(ev);
        keyboardEvent(cmd);
    });
    // also children and grandchildren and...
    $(".vkbd_button").find().click(function (ev) {
        var cmd = clickEvent(ev);
        keyboardEvent(cmd);
    });
    // dragElement(document.getElementById("vkbd"));
    var vkbdElement = document.getElementById('vkbd');
    // https://hammerjs.github.io/getting-started/
    var mc = new Hammer(vkbdElement);

    var left_temp = 1;
    var top_temp = 1;
    var left_start = 1;
    var top_start = 1;
    mc.on("panstart panmove", function (ev) {
        if (ev.type == 'panstart') {
            left_start = vkbdElement.offsetLeft;
            top_start = vkbdElement.offsetTop;
            left_temp = left_start;
            top_temp = top_start;
        }
        if (ev.type == 'panmove') {
            left_temp = left_start + ev.deltaX;
            top_temp = top_start + ev.deltaY;
            vkbdElement.style.left = left_temp + 'px';
            vkbdElement.style.top = top_temp + 'px';
        }
    });
    var scale_temp = 1;
    var scale_start = 1;
    mc.get('pinch').set({
        enable: true
    });
    mc.on('pinch pinchstart', function (ev) {
        if (ev.type == 'pinchstart') {
            // start with scale_temp of the last pinch
            scale_start = scale_temp;
        }
        if (ev.type == 'pinch') {
            scale_temp = scale_start * ev.scale;
            var scalecommand = "translate(-50%, -50%) scale(" + scale_temp + ")";
            console.log(scalecommand);
            $("#vkbd").css("transform", scalecommand);
        }
    });


    function clickEvent(ev) {
        var cmd = $(ev.target).attr('cmd');
        if (typeof cmd == 'undefined') {
            var temp = $(ev.target).parents().filter('.vkbd_button');
            cmd = $(temp).attr('cmd');
        }
        return cmd;
        console.log(cmd);
        // $('#output').text(cmd);
    }


}

// tabs for the different keyboards
function tabClick(ev, table_id) {
    // console.log(ev);
    console.log(table_id);
    $('#vkbd table').css("display", "none");
    $('#vkbd table#' + table_id).css("display", "table");
    $('.vkbd_tab button').removeClass("selected");
    $('.vkbd_tab button#button-' + table_id).addClass("selected");
}

var vkbdLoaded = true;