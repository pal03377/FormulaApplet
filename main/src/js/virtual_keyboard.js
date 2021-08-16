"use strict";

import { keyboardEvent } from "./prepare_page.js";

const squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';
const nth_root = '<sup style="position: relative; top: -0.5em; right: -0.5em;">\u2b1a</sup>' + squareroot;
const left = ['left', '<span style="font-size: 130%">\u25c5</span>', '#Left'];
const right = ['right', '<span style="font-size: 130%">\u25bb</span>', '#Right'];
// ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],
const enter = ['enter', '<span style="font-size: 150%; color:green">\u23ce</span>', '#Enter'];
const backspace = ['backspace', '\u232B', '#Backspace'];
const poweroften = ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>', '10^'];

var keys = [];
keys['mixed'] = [
    // row 0
    [
        // [name, UTF-8, command] 
        // #command -> mathfield.keystroke(command)
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
        poweroften,
        ['lg', 'lg', 'lg('],
        ['power', '\u2b1a<sup>\u2b1a</sup>', '^'],
         ['nth_root', nth_root, '#nthroot'],
         ['smallgap-2', '', ''],
        ['1'],
        ['2'],
        ['3'],
        ['up', '↑', '^'],
        backspace,
    ],
    // row 3
    [
        ['bracket-left', '(', '('],
        ['bracket-right', ')', ')'],
        ['square', '\u2b1a<sup style="font-size: 85%">2</sup>', '#square'],
        // notice the space at end of string
        ['squareroot', squareroot, '\\sqrt '],
        ['smallgap-3', '', ''],
        ['0'],
        ['comma', ',', ','],
        left,
        right,
        enter,
    ]
]

// obsolete
// ['exp', 'e<sup><small>\u2b1a</small></sup>'],
// ['power', '\u2b1a<sup>\u2b1a</sup>', '&nbsp;^&nbsp;'],
// ['nth_root', '<sup id="sup_root">\u2b1a</sup>' + squareroot],
// ['nth_root', '\u221a', '\\nthroot'],
// ['up', '\uffea'],
// ['up', '↑'],
// ['backspace', '⇐', 'backspace']
// ['left', '←'],
// ['right', '→'],
// ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],

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
        ['set_unit', '<span class="tr de kunit">Einheit</span><span class="tr en kunit">Unit</span>', '#set_unit'],
        // ['set_unit-en', 'Unit', '#set_unit'],
        // ['set_unit-de', 'Einheit', '#set_unit'],
        ['pi', '&pi;', '\\pi ']
    ],
    // row 1
    [
        ['arcsin', '<span style="font-size: 85%">sin<sup>-1</sup></span>'],
        ['arccos', '<span style="font-size: 85%">cos<sup>-1</sup></span>'],
        ['arctan', '<span style="font-size: 85%">tan<sup>-1</sup></span>'],
        ['smallgap-1', '', ''],
        ['abs', '\u2502\u2b1a\u2502', '| |'],
        ['subscript', '\u2b1a<sub style="font-size: 85%">\u2b1a</sub>'],
        // ['nth_root', nth_root, '#nthroot'],
        ['space', '<span class="tr de kspace">Leer</span><span class="tr en kspace">Space</span>', '\\ '],
        ['erase_unit', '<span class="tr de kclru">Einheit<br>l&ouml;schen</span><span class="tr en kclru">Clear<br>Unit</span>', '#erase_unit'],
        ['infinity', '&infin;', '\\infinity ']
    ],
    // row 2
    [
        ['ln'],
        ['lg'],
        ['log_base', 'log<sub style="font-size: 85%">\u2b1a</sub>', 'log_'],
        ['smallgap-2', '', ''],
        ['bracket-left', '(', '('],
        ['bracket-right', ')', ')'],
        ['up', '&uarr;', '#Up'],
        ['down', '&darr;', '#Down'],
        backspace,
    ],
    // row 3
    [
        ['exp', 'e<sup style="font-size: 85%">\u2b1a</sup>'],
        poweroften,
        ['power', '\u2b1a<sup>\u2b1a</sup>', '^'],
        ['smallgap-3', '', ''],
        ['squareroot', squareroot, '\\sqrt '],
        // ['keyboard', '\u2328', '\\xyz '],
        ['abs', '<span style="font-size: 85%">abs</span>'],
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

function get_virtualKeyboard() {
    var result = '<div id="virtualKeyboard">\r\n';
    result += '  <div id="virtualKeyboard_header">Move</div>\r\n';
    // create tabs
    result += '  <div class="virtualKeyboard_tab"\r\n>';
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
        result += '<tr class="virtualKeyboard-row' + row_number + '">\r\n';
        // console.log( '<tr class="virtualKeyboard-row' + row_number + '">\r\n' );
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
            var cl = 'virtualKeyboard_button virtualKeyboard-' + key[0];
            if (key[0].startsWith('smallgap')) {
                cl += ' smallgap';
            }
            // if (key[0].startsWith('set_unit-')) {
            //     lang= key[0].substr(9,2);
            //     console.log('key lang=' + lang);
            //     cl = 'tr ' + lang + ' kunit ' + cl;
            //     console.log(cl);
            // }
            result += '<td class="' + cl + '" cmd="';
            result += key[2] + '">' + key[1] + '</td>\r\n';
            // console.log('virtualKeyboard-' + key[0] + ' ' + key[1] + ' cmd-' + key[2]);
        }
        result += '</tr>\r\n';
        // console.log(row);
    }
    result += '</tbody>\r\n';
    result += '</table>\r\n';
    return result;
}

function virtualKeyboard_bind_events() {
    //console.log('Init virtualKeyboard');
    $(".virtualKeyboard_button").mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent_0(cmd);
    });
    // also children and grandchildren and...
    $(".virtualKeyboard_button").find().mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent_0(cmd);
    });
    // dragElement(document.getElementById("virtualKeyboard"));
    var virtualKeyboardElement = document.getElementById('virtualKeyboard');
    // https://hammerjs.github.io/getting-started/
    var mc = new Hammer(virtualKeyboardElement);

    var left_temp = 1;
    var top_temp = 1;
    var left_start = 1;
    var top_start = 1;
    mc.on("panstart panmove", function (ev) {
        if (ev.type == 'panstart') {
            left_start = virtualKeyboardElement.offsetLeft;
            top_start = virtualKeyboardElement.offsetTop;
            left_temp = left_start;
            top_temp = top_start;
        }
        if (ev.type == 'panmove') {
            left_temp = left_start + ev.deltaX;
            top_temp = top_start + ev.deltaY;
            virtualKeyboardElement.style.left = left_temp + 'px';
            virtualKeyboardElement.style.top = top_temp + 'px';
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
            //console.log(scalecommand);
            $("#virtualKeyboard").css("transform", scalecommand);
        }
    });

    function clickEvent(ev) {
        //console.log(ev);
        var cmd = $(ev.target).attr('cmd');
        if (typeof cmd == 'undefined') {
            var temp = $(ev.target).parents().filter('.virtualKeyboard_button');
            cmd = $(temp).attr('cmd');
        }
        //console.log(cmd);
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
        keyboardEvent(cmd);
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
    $('.virtualKeyboard_tab button').removeClass("selected");
    switch (keyboard_id) {
        case 'abc':
        case 'abc_caps':
        case 'abc_capslock':
            $('.virtualKeyboard_tab button#button-table_abc').addClass("selected");
            var buttontext = 'abc'
            if (keyboard_id == 'abc_caps') {
                buttontext = 'ABC';
            }
            if (keyboard_id == 'abc_capslock') {
                buttontext = '[ABC]';
            }
            $('.virtualKeyboard_tab button#button-table_abc').text(buttontext);
            break;
        case 'greek':
        case 'greek_caps':
        case 'greek_capslock':
            $('.virtualKeyboard_tab button#button-table_greek').addClass("selected");
            var buttontext = '\u03b1\u03b2\u03b3'
            if (keyboard_id == 'greek_caps') {
                buttontext = '\u0391\u0392\u0393';
            }
            if (keyboard_id == 'greek_capslock') {
                buttontext = '[\u0391\u0392\u0393]';
            }
            $('.virtualKeyboard_tab button#button-table_greek').text(buttontext);
            break;
        case 'off':
            virtualKeyboard_hide();
            break;
        default:
            $('.virtualKeyboard_tab button#button-table_' + keyboard_id).addClass("selected");
    }
    $('#virtualKeyboard table').css("display", "none");
    var temp = keyboard_id;
    if (keyboard_id == 'abc_capslock') {
        temp = 'abc_caps';
    }
    if (keyboard_id == 'greek_capslock') {
        temp = 'greek_caps';
    }
    $('#virtualKeyboard table#table_' + temp).css("display", "table");
    activeKeyboard = keyboard_id;
}

// tabs for the different keyboards
// TODO: needs to be available for onlick of the buttons somehow
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
    $('#virtualKeyboard table').css("display", "none");
    $('#virtualKeyboard table#table_' + activeKeyboard).css("display", "table");
    keyboardActivate(activeKeyboard);
}

export default function virtualKeyboard_init() {
    var kb = $('#keyboard')[0];
    // console.log('kb=' + kb);
    if (typeof kb == 'undefined') {
        kb = document.createElement('div');
        kb.id = 'keyboard';
        document.body.appendChild(kb);
    }
    $('#keyboard').html(get_virtualKeyboard());
    virtualKeyboard_bind_events();
    keyboardActivate('mixed');
    virtualKeyboard_hide();
}

function virtualKeyboard_hide() {
    $('#virtualKeyboard').css("display", "none");
    $('.formula_applet.selected').nextAll("button.keyb_button:first").addClass('selected');
}

export function virtualKeyboard_show() {
    $('#virtualKeyboard').css("display", "table");
    $('#virtualKeyboard table').css("display", "none");
    keyboardActivate('mixed');
    $('#virtualKeyboard table#table_' + activeKeyboard).css("display", "table");
}