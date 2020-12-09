var squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';
var nth_root = '<sup style="position: relative; top: -0.5em; right: -0.5em;">\u2b1a</sup>' + squareroot;
var left = ['left', '<span style="font-size: 130%">\u25c5</span>', '#Left'];
var right = ['right', '<span style="font-size: 130%">\u25bb</span>', '#Right'];
// ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],
var enter = ['enter', '<span style="font-size: 150%; color:green">\u23ce</span>', '#Enter'];
var backspace = ['backspace', '\u232B', '#Backspace'];

var keys = [];
keys['mixed'] = [
    // row 0
    [
        // [name, UTF-8, command] #command -> mathfield.keystroke(command)
        ['a'],
        ['b'],
        ['c'],
        ['pi', '&pi;', '\\pi '],
        ['smallgap-0', '', ''],
        ['7'],
        ['8'],
        ['9'],
        ['times', '&times;', '\\cdot '],
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
        ['up', '↑', '^'],
        // ['up', '\uffea'],
        backspace,
        // ['backspace', '⇐', 'backspace']
    ],
    // row 3
    [
        ['bracket-left', '('],
        ['bracket-right', ')'],
        ['square', '\u2b1a<sup style="font-size: 85%">2</sup>'],
        // notice the space at end of string
        ['squareroot', squareroot, '\\sqrt '],
        ['smallgap-3', '', ''],
        ['0'],
        // ['.'],
        ['comma', ','],
        // ['left', '←'],
        // ['right', '→'],
        left,
        right,
        // ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],
        enter,
        // ['equal2', '=', '='],
    ]
]

keys['function'] = [
    // row 0
    [
        ['sin', '<span style="font-size: 85%">sin</span>'],
        ['cos', '<span style="font-size: 85%">cos</span>'],
        ['tan', '<span style="font-size: 85%">tan</span>'],
        ['smallgap-0', '', ''],
        ['degree', '°'],
        ['minute', '\''],
        ['second', '\'\''],
        ['set_unit', 'Unit', '#set_unit'],
        ['pi', '&pi;', '\\pi ']
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
        ['erase_unit', 'Clear<br>Unit', '#erase_unit'],
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
        // ['up', '↑'],
        ['up', '&uarr;'],
        ['down', '&darr;'],
        backspace,
    ],
    // row 3
    [
        ['exp', 'e<sup style="font-size: 85%">\u2b1a</sup>'],
        ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>'],
        ['power', '\u2b1a<sup>\u2b1a</sup>'],
        ['smallgap-3', '', ''],
        ['squareroot', squareroot],
        ['pi', '&pi;', '\\pi '],
        left,
        right,
        enter,
    ],
]

keys['abc'] = [
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
        backspace,
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
        left,
        right,
        enter,
    ]
]

keys['abc_caps'] = [
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
        backspace,
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
        // ['left', '←'],
        // ['right', '→'],
        left,
        right,
        enter,
    ]
]

keys['greek'] = [
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
    ],
    // row 1
    [
        ['varphi', '&phi;'],
        ['zeta', '&zeta;'],
        ['epsilon', '&epsilon;'],
        ['rho', '&rho;'],
        ['tau', '&tau;'],
        ['ypsilon', '&upsilon;', '\\upsilon '],
        ['theta', '&theta;'],
        ['iota', '&iota;'],
        ['omikron', '&omicron;', '\\omicron '],
        ['pi', '&pi;']
    ],
    // row 1
    [
        ['alpha', '&alpha;'],
        ['sigma', '&sigma;'],
        ['delta', '&delta;'],
        ['phi', '&varphi;'],
        ['gamma', '&gamma;'],
        ['eta', '&eta;'],
        ['xi', '&xi;'],
        ['kappa', '&kappa;'],
        ['lambda', '&lambda;'],
        backspace,
    ],
    // row 2
    [
        ['shift', '⇑'],
        ['zeta', '&zeta;'],
        ['chi', '&chi;'],
        ['psi', '&psi;'],
        ['omega', '&omega;'],
        ['beta', '&beta;'],
        ['ny', '&nu;', '\\nu '],
        ['my', '&mu;', '\\mu '],
        left,
        right,
        enter
    ]
]
keys['greek_caps'] = [
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
    ],
    // row 1
    [
        ['Phi', '&Phi;'],
        ['Zeta', '&Zeta;'],
        ['Epsilon', '&Epsilon;'],
        ['Rho', '&Rho;'],
        ['Tau', '&Tau;'],
        ['Upsilon', '&Upsilon;'],
        ['Theta', '&Theta;'],
        ['Iota', '&Iota;'],
        ['Omikron', '&Omicron;'],
        ['Pi', '&Pi;']
    ],
    // row 1
    [
        ['Alpha', '&Alpha;'],
        ['Sigma', '&Sigma;'],
        ['Delta', '&Delta;'],
        ['Phi', '&Phi;'],
        ['Gamma', '&Gamma;'],
        ['Eta', '&Eta;'],
        ['Xi', '&Xi;'],
        ['Kappa', '&Kappa;'],
        ['Lambda', '&Lambda;'],
        backspace,
    ],
    // row 2
    [
        ['shift', '⇑'],
        ['Zeta', '&Zeta;'],
        ['Chi', '&Chi;'],
        ['Psi', '&Psi;'],
        ['Omega', '&Omega;'],
        ['Beta', '&Beta;'],
        ['Ny', '&Nu;'],
        ['My', '&Mu;'],
        left,
        right,
        enter
    ]
]

function get_vkbd() {
    var result = '<div id="vkbd">\r\n';
    result += '  <div id="vkbd_header">Move</div>\r\n';
    // create tabs
    result += '  <div class="vkbd_tab"\r\n>';
    result += '      <button class="tablinks" id="button-table_mixed" onclick="tabClick(event, \'mixed\')">123&radic;+-&nbsp;&nbsp;&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_function" onclick="tabClick(event, \'function\')">&nbsp;f(x)&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_abc" onclick="tabClick(event, \'abc\')">abc</button>\r\n';
    // result += '      <button class="tablinks" id="button-table_abc_caps" onclick="tabClick(event, \'abc_caps\')">ABC</button>\r\n';
    result += '      <button class="tablinks" id="button-table_greek" onclick="tabClick(event, \'greek\')">\u03b1\u03b2\u03b3</button>\r\n';
    // result += '      <button class="tablinks" id="button-table_greek_caps" onclick="tabClick(event, \'greek_caps\')">&Alpha;&Beta;&Gamma;</button>\r\n';
    // https://en.wikipedia.org/wiki/X_mark
    // result += '      <button class="tablinks" id="button-table_off" onclick="tabClick(event, \'off\')">&nbsp;\u2716&nbsp;\u274C</button>\r\n';
    // result += '      <button class="tablinks" id="button-table_off" onclick="tabClick(event, \'off\')">&nbsp;\u274C&nbsp;</button>\r\n';
    result += '      <button class="tablinks" id="button-table_off" onclick="tabClick(event, \'off\')">&nbsp;\u2716</button>\r\n'; // alternative \u2715
    result += '  </div>\r\n';

    result += create_table('abc');
    result += create_table('abc_caps');
    result += create_table('mixed');
    result += create_table('function');
    result += create_table('greek');
    result += create_table('greek_caps');
    result += '</div>\r\n';
    return result;
}

function create_table(table_id) {
    var result = '<table id="table_' + table_id + '">\r\n';
    result += '<tbody>\r\n';
    for (var row_number = 0; row_number < keys[table_id].length; row_number++) {
        var keylist = keys[table_id][row_number];
        result += '<tr class="vkbd-row' + row_number + '">\r\n';
        // console.log( '<tr class="vkbd-row' + row_number + '">\r\n' );
        // result += '<tr>\r\n';
        for (var keyindex = 0; keyindex < keylist.length; keyindex++) {
            var key = keylist[keyindex];
            if (typeof key[1] == 'undefined') {
                key[1] = key[0];
            }
            if (typeof key[2] == 'undefined') {
                if (table_id == 'greek' || table_id == 'greek_caps') {
                    const ignore = '0_1_2_3_4_5_6_7_8_9_shift_';
                    if (ignore.indexOf(key[0] + '_') < 0) {
                        key[2] = '\\' + key[0] + ' ';
                        // console.log('done ' + key[2] + '*');
                    } else {
                        key[2] = key[0];
                    }
                } else {
                    key[2] = key[0];
                }
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
    $(".vkbd_button").mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent_0(cmd);
    });
    // also children and grandchildren and...
    $(".vkbd_button").find().mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent_0(cmd);
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
        console.log(ev);
        var cmd = $(ev.target).attr('cmd');
        if (typeof cmd == 'undefined') {
            var temp = $(ev.target).parents().filter('.vkbd_button');
            cmd = $(temp).attr('cmd');
        }
        console.log(cmd);
        // $('#output').text(cmd);
        return cmd;
    }
}

function keyboardEvent_0(cmd) {
    if (cmd.toLowerCase() == 'shift') {
        switch (activeKeyboard) {
            case 'abc':
                activeKeyboard = 'abc_caps';
                break;
            case 'abc_caps':
                activeKeyboard = 'abc_capslock';
                break;
            case 'abc_capslock':
                activeKeyboard = 'abc';
                break;
            default:
                // activeKeyboard = 'abc';
        }
        switch (activeKeyboard) {
            case 'greek':
                activeKeyboard = 'greek_caps';
                break;
            case 'greek_caps':
                activeKeyboard = 'greek_capslock';
                break;
            case 'greek_capslock':
                activeKeyboard = 'greek';
                break;
            default:
                // activeKeyboard = 'abc';
                // no change of keyboard

        }
    } else {
        // will be overwritten in *.php files
        keyboardEvent(cmd); //defined in prepare_page
        // switch back
        if (activeKeyboard == 'abc_caps') {
            activeKeyboard = 'abc';
        }
        if (activeKeyboard == 'greek_caps') {
            activeKeyboard = 'greek';
        }
    }
    keyboardActivate(activeKeyboard);
}

var activeKeyboard = 'dummy';

function keyboardActivate(keyboard_id) {
    // console.log(keyboard_id);
    $('.vkbd_tab button').removeClass("selected");
    switch (keyboard_id) {
        case 'abc':
        case 'abc_caps':
        case 'abc_capslock':
            $('.vkbd_tab button#button-table_abc').addClass("selected");
            var buttontext = 'abc'
            if (keyboard_id == 'abc_caps') {
                buttontext = 'ABC';
            }
            if (keyboard_id == 'abc_capslock') {
                buttontext = '[ABC]';
            }
            $('.vkbd_tab button#button-table_abc').text(buttontext);
            break;
        case 'greek':
        case 'greek_caps':
        case 'greek_capslock':
            $('.vkbd_tab button#button-table_greek').addClass("selected");
            var buttontext = '\u03b1\u03b2\u03b3'
            if (keyboard_id == 'greek_caps') {
                buttontext = '\u0391\u0392\u0393';
            }
            if (keyboard_id == 'greek_capslock') {
                buttontext = '[\u0391\u0392\u0393]';
            }
            $('.vkbd_tab button#button-table_greek').text(buttontext);
            break;
        case 'off':
            vkbd_hide();
            break;
        default:
            $('.vkbd_tab button#button-table_' + keyboard_id).addClass("selected");
    }
    $('#vkbd table').css("display", "none");
    var temp = keyboard_id;
    if (keyboard_id == 'abc_capslock') {
        temp = 'abc_caps';
    }
    if (keyboard_id == 'greek_capslock') {
        temp = 'greek_caps';
    }
    $('#vkbd table#table_' + temp).css("display", "table");
    activeKeyboard = keyboard_id;
}

// tabs for the different keyboards
function tabClick(ev, keyboard_id) {
    switch (keyboard_id) {
        case 'abc':
            // toggle abc and abc_caps
            if (activeKeyboard == 'abc') {
                activeKeyboard = 'abc_caps'
            } else {
                activeKeyboard = 'abc'
            }
            break;
        case 'greek':
            // toggle greek and greek_caps
            if (activeKeyboard == 'greek') {
                activeKeyboard = 'greek_caps'
            } else {
                activeKeyboard = 'greek'
            }
            break;
        default:
            activeKeyboard = keyboard_id;
    }
    $('#vkbd table').css("display", "none");
    $('#vkbd table#table_' + activeKeyboard).css("display", "table");
    keyboardActivate(activeKeyboard);
}

function vkbd_init() {
    var kb = $('#keyboard')[0];
    // console.log('kb=' + kb);
    if (typeof kb == 'undefined') {
        kb = document.createElement('div');
        kb.id = 'keyboard';
        document.body.appendChild(kb);
    }
    $('#keyboard').html(get_vkbd());
    vkbd_bind_events();
    keyboardActivate('mixed');
    vkbd_hide();
}

function vkbd_hide() {
    $('#vkbd').css("display", "none");
}

function vkbd_show() {
    $('#vkbd').css("display", "table");
    $('#vkbd table').css("display", "none");
    keyboardActivate('mixed');
    $('#vkbd table#table_' + activeKeyboard).css("display", "table");
}

var vkbdLoaded = true;