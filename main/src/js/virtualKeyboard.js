"use strict";

<<<<<<< HEAD:js/vkbd.js
var squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';
var nth_root = '<sup style="position: relative; top: -0.5em; right: -0.5em;">\u2b1a</sup>' + squareroot;
var left = ['left', '<span style="font-size: 130%">\u25c5</span>', '#Left'];
var right = ['right', '<span style="font-size: 130%">\u25bb</span>', '#Right'];
// ['enter2', '<span style="font-size: 170%; color:green">\u21b5</span>', 'enter'],
var enter = ['enter', '<span style="font-size: 150%; color:green">\u23ce</span>', '#Enter'];
var backspace = ['backspace', '\u232B', '#Backspace'];
var poweroften =     ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>', '10^'];
=======
import $ from "jquery";
import Hammer from "@egjs/hammerjs";
import { keyboardEvent } from "./preparePage.js";

const squareroot = '<span style="white-space: nowrap; font-size:larger">&radic;<span style="text-decoration:overline;">&nbsp;&#x2b1a;&nbsp;</span></span>';
const nthRoot = '<sup style="position: relative; top: -0.5em; right: -0.5em;">\u2b1a</sup>' + squareroot;
const left = ['left', '<span style="font-size: 130%">\u25c5</span>', '#Left'];
const right = ['right', '<span style="font-size: 130%">\u25bb</span>', '#Right'];
const enter = ['enter', '<span style="font-size: 150%; color:green">\u23ce</span>', '#Enter'];
const backspace = ['backspace', '\u232B', '#Backspace'];
const poweroften = ['power_of_ten', '10<sup style="font-size: 85%">\u2b1a</sup>', '10^'];
>>>>>>> 5e71768f70a96963c5acf1085b25830ec7924ff2:main/src/js/virtualKeyboard.js

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
        ['nthRoot', nthRoot, '#nthroot'],
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
        ['setUnit', '<span class="tr de kunit">Einheit</span><span class="tr en kunit">Unit</span>', '#setUnit'],
        // ['setUnit-en', 'Unit', '#setUnit'],
        // ['setUnit-de', 'Einheit', '#setUnit'],
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
        // ['nthRoot', nthRoot, '#nthroot'],
        ['space', '<span class="tr de kspace">Leer</span><span class="tr en kspace">Space</span>', '\\ '],
        ['eraseUnit', '<span class="tr de kclru">Einheit<br>l&ouml;schen</span><span class="tr en kclru">Clear<br>Unit</span>', '#eraseUnit'],
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

function getVirtualKeyboard() {
    let result = document.createElement("div");
    result.id = "virtualKeyboard";
    let header = document.createElement("div");
    header.id = "virtualKeyboard_header";
    header.innerText = "Move";
    result.append(header);
    let tabs = document.createElement("div");
    tabs.id = "virtualKeyboard_tab";
    tabs.classList.add("virtualKeyboard_tab");
    const tabButtons = {
        "mixed": "123&radic;+-&nbsp;&nbsp;&nbsp;", 
        "function": "&nbsp;f(x)&nbsp;", 
        "abc": "abc", 
        "greek": "\u03b1\u03b2\u03b3", 
        "off": "&nbsp;\u2716"
    };
    for (let tabId of Object.keys(tabButtons)) {
        let button = document.createElement("button");
        button.classList.add("tablinks");
        button.id = "button-table_" + tabId;
        button.onclick = evt => tabClick(evt, tabId);
        button.innerHTML = tabButtons[tabId];
        tabs.append(button);
    }
    result.append(tabs);

    for (let tabId of ["abc", "abc_caps", "mixed", "function", "greek", "greek_caps"]) {
        result.append(createTable(tabId));
    }
    
    return result;
}

function createTable(tableId) {
    let result = document.createElement("table");
    result.id = "table_" + tableId;
    let tbody = document.createElement("tbody");
    result.append(tbody);
    for (let rowNumber = 0; rowNumber < keys[tableId].length; rowNumber ++) {
        var keylist = keys[tableId][rowNumber];
        let tr = document.createElement("tr");
        tr.classList.add("virtualKeyboard-row" + rowNumber);
        tbody.append(tr);
        for (var keyindex = 0; keyindex < keylist.length; keyindex++) {
            var key = keylist[keyindex];
            if (typeof key[1] == 'undefined') {
                key[1] = key[0];
            }
            if (typeof key[2] == 'undefined') {
<<<<<<< HEAD:js/vkbd.js
                if (table_id == 'greek' || table_id == 'greek_caps') {
                    var ignore = '0_1_2_3_4_5_6_7_8_9_shift_';
=======
                if (tableId == 'greek' || tableId == 'greek_caps') {
                    const ignore = '0_1_2_3_4_5_6_7_8_9_shift_';
>>>>>>> 5e71768f70a96963c5acf1085b25830ec7924ff2:main/src/js/virtualKeyboard.js
                    if (ignore.indexOf(key[0] + '_') < 0) {
                        key[2] = '\\' + key[0] + ' ';
                    } else {
                        key[2] = key[0];
                    }
                } else {
                    key[2] = key[0];
                }
            }
            let td = document.createElement("td");
            td.classList.add("virtualKeyboardButton");
            td.classList.add("virtualKeyboard-" + key[0]);
            if (key[0].startsWith('smallgap')) {
                td.classList.add("smallgap");
            }
            td.setAttribute("cmd", key[2]);
            td.innerHTML = key[1];
            tr.append(td);
        }
    }
    return result;
}

function virtualKeyboardBindEvents() {
    $(".virtualKeyboardButton").mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent0(cmd);
    });
    // also children and grandchildren and...
    $(".virtualKeyboardButton").find().mousedown(function (ev) {
        ev.preventDefault();
        var cmd = clickEvent(ev);
        keyboardEvent0(cmd);
    });
    // dragElement(document.getElementById("virtualKeyboard"));
    var virtualKeyboardElement = document.getElementById('virtualKeyboard');
    // https://hammerjs.github.io/getting-started/
    var mc = new Hammer(virtualKeyboardElement);

    var leftTemp = 1;
    var topTemp = 1;
    var leftStart = 1;
    var topStart = 1;
    mc.on("panstart panmove", function (ev) {
        if (ev.type == 'panstart') {
            leftStart = virtualKeyboardElement.offsetLeft;
            topStart = virtualKeyboardElement.offsetTop;
            leftTemp = leftStart;
            topTemp = topStart;
        }
        if (ev.type == 'panmove') {
            leftTemp = leftStart + ev.deltaX;
            topTemp = topStart + ev.deltaY;
            virtualKeyboardElement.style.left = leftTemp + 'px';
            virtualKeyboardElement.style.top = topTemp + 'px';
        }
    });
    var scaleTemp = 1;
    var scaleStart = 1;
    mc.get('pinch').set({
        enable: true
    });

    mc.on('pinch pinchstart', function (ev) {
        if (ev.type == 'pinchstart') {
            // start with scaleTemp of the last pinch
            scaleStart = scaleTemp;
        }
        if (ev.type == 'pinch') {
            scaleTemp = scaleStart * ev.scale;
            var scalecommand = "translate(-50%, -50%) scale(" + scaleTemp + ")";
            $("#virtualKeyboard").css("transform", scalecommand);
        }
    });

    function clickEvent(ev) {
        var cmd = $(ev.target).attr('cmd');
        if (typeof cmd == 'undefined') {
            var temp = $(ev.target).parents().filter('.virtualKeyboardButton');
            cmd = $(temp).attr('cmd');
        }
        // $('#output').text(cmd);
        return cmd;
    }
}

function keyboardEvent0(cmd) {
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

function keyboardActivate(keyboardId) {
    $('.virtualKeyboard_tab button').removeClass("selected");
    switch (keyboardId) {
        case 'abc':
        case 'abc_caps':
        case 'abc_capslock':
            $('.virtualKeyboard_tab button#button-table_abc').addClass("selected");
            var buttontext = 'abc'
            if (keyboardId == 'abc_caps') {
                buttontext = 'ABC';
            }
            if (keyboardId == 'abc_capslock') {
                buttontext = '[ABC]';
            }
            $('.virtualKeyboard_tab button#button-table_abc').text(buttontext);
            break;
        case 'greek':
        case 'greek_caps':
        case 'greek_capslock':
            $('.virtualKeyboard_tab button#button-table_greek').addClass("selected");
            var buttontext = '\u03b1\u03b2\u03b3'
            if (keyboardId == 'greek_caps') {
                buttontext = '\u0391\u0392\u0393';
            }
            if (keyboardId == 'greek_capslock') {
                buttontext = '[\u0391\u0392\u0393]';
            }
            $('.virtualKeyboard_tab button#button-table_greek').text(buttontext);
            break;
        case 'off':
            hideVirtualKeyboard();
            break;
        default:
            $('.virtualKeyboard_tab button#button-table_' + keyboardId).addClass("selected");
    }
    $('#virtualKeyboard table').css("display", "none");
    var temp = keyboardId;
    if (keyboardId == 'abc_capslock') {
        temp = 'abc_caps';
    }
    if (keyboardId == 'greek_capslock') {
        temp = 'greek_caps';
    }
    $('#virtualKeyboard table#table_' + temp).css("display", "table");
    activeKeyboard = keyboardId;
}

// tabs for the different keyboards
function tabClick(ev, keyboardId) {
    switch (keyboardId) {
        case 'abc':
            // toggle abc and abc_caps
            if (activeKeyboard == 'abc') {
                activeKeyboard = 'abc_caps';
            } else {
                activeKeyboard = 'abc';
            }
            break;
        case 'greek':
            // toggle greek and greek_caps
            if (activeKeyboard == 'greek') {
                activeKeyboard = 'greek_caps';
            } else {
                activeKeyboard = 'greek';
            }
            break;
        default:
            activeKeyboard = keyboardId;
    }
    $('#virtualKeyboard table').css("display", "none");
    $('#virtualKeyboard table#table_' + activeKeyboard).css("display", "table");
    keyboardActivate(activeKeyboard);
}

export default function initVirtualKeyboard() {
    var kb = $('#keyboard')[0];
    if (typeof kb == 'undefined') {
        kb = document.createElement('div');
        kb.id = 'keyboard';
        kb.append(getVirtualKeyboard());
        document.body.appendChild(kb);
    }
    virtualKeyboardBindEvents();
    keyboardActivate('mixed');
    hideVirtualKeyboard();
}

function hideVirtualKeyboard() {
    $('#virtualKeyboard').css('display', 'none');
    $('.formula_applet.selected').nextAll("button.keyb_button:first").addClass('selected');
}

export function showVirtualKeyboard() {
    $('#virtualKeyboard').css('display', 'table');
    $('#virtualKeyboard table').css('display', 'none');
    keyboardActivate('mixed');
    $('#virtualKeyboard table#table_' + activeKeyboard).css('display', 'table');
}