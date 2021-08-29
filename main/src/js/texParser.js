/** 
 * Code for traversing: 
 * https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393 
 * https://www.geeksforgeeks.org/what-is-export-default-in-javascript/
 * **/


"use strict";
// Klasse als Funktion in JS
function node() {
    this.id = -1;
    this.parent = 0;
    this.children = [];
    this.type = 'space';
    this.content = '';
    this.value = 'u';
}

node.prototype.addBracket = function (tree) {
    var temp = findLeftmostBracket(this.content);
    var leftPos = temp[0];
    var bra = temp[1];
    bracket = findCorrespondingRightBracket(this.content, bra);
    var leftPos2 = bracket.leftPos;
    var bra_len = bracket.bracketLength;
    var rightPos = bracket.rightPos;
    var rightbra_len = bracket.rightBracketLength;
    // this should not happen
    if (leftPos !== leftPos2) {
        throw 'Inconsistent left positions ';
    }
    if (leftPos > -1 && rightPos > -1) {
        var leftpart = this.content.substring(0, leftPos);
        var middlepart = this.content.substring(leftPos + bra_len, rightPos);
        var rightpart = this.content.substring(rightPos + rightbra_len);
        this.content = leftpart + '§' + rightpart;
        var bracket = createNode('bracket-' + bra, '', tree);
        var middle = createNode('leaf', middlepart, tree);
        if (middlepart == ' ') { // e.g. indefinite integral
            middle.type = 'empty';
        }
        // first connection
        this.children.push(bracket.id);

        bracket.parent = this.id;
        // second connection
        bracket.children.push(middle.id);
        middle.parent = bracket.id;
    } else {
        // else no pair of brackets found
        leftPos = -1;
    }
    return leftPos;
};

node.prototype.debug = function () {
    var text = this.id + ': parent=' + this.parent;
    text += ' children=' + this.children;
    text += ' type=' + this.type;
    text += ' content=' + this.content;
    console.debug(text);
    return text;
};

function createNode(type, content, tree) {
    var nodelist = tree.nodelist;
    var lof = tree.listOfFree || [];
    var temp = '';
    if (lof.length === 0) {
        temp = new node();
        temp.type = type;
        temp.content = content;
        nodelist.push(temp);
        temp.id = nodelist.length - 1;
        return temp;
    } else {
        var lastFree = lof.pop();
        temp = nodelist[lastFree];
        temp.type = type;
        temp.content = content;
        temp.children = [];
        return temp;
    }
}

export class FaTree {
    constructor() {
        this.listOfFree = [];
        this.nodelist = [];
        this.nodelist[0] = new node();
        this.root = this.nodelist[0];
        this.root.type = 'root';
        this.root.id = 0;
        this.root.parent = -1;
        this.leaf = new node();
        this.leaf.type = 'leaf';
        this.leaf.content = 'my first leaf';
        this.nodelist[1] = this.leaf;
        this.leaf.id = 1;
        this.leaf.parent = this.root.id;
        this.root.children = [this.leaf.id];
        this.hasValue = false;
        this.variableValueList = [];
    }
}

function withEachNode(tree, f) {
    var i = 0;
    var stop = false;
    var listOfNodes = tree.nodelist;
    do {
        var node = listOfNodes[i];
        // doThis may add or delete nodes!
        f(node);
        i++;
        if (i === tree.nodelist.length) {
            stop = true;
        }
    } while (stop === false)
}

function withEachLeaf(tree, f) {
    withEachNode(tree, function (node) {
        if (node.type == 'leaf') {
            f(node);
        }
    })
}

function withEachLeafOrGreek(tree, f) {
    withEachNode(tree, function (node) {
        if (node.type == 'leaf' || node.type == 'greek') {
            f(node);
        }
    })
}

export function isInUnit(tree, node) {
    var result = false;
    var stop = false;
    do {
        if (node.type == 'unit') {
            result = true;
            stop = true;
        } else {
            node = tree.nodelist[node.parent];
            if (node.type == 'root') {
                stop = true;
            }
        }
    } while (stop === false);
    return result;
}

function deleteSingleNodes(tree) {
    // delete § nodes
    // nodes with type='free' may not be deleted a second time
    withEachNode(tree, function (node) {
        if (node.content === '§' && node.children.length === 1 && node.type !== 'free') {
            var siblings = tree.nodelist[node.parent].children;
            var position = siblings.indexOf(node.id);
            // short circuit
            siblings[position] = node.children[0];
            tree.nodelist[node.children[0]].parent = node.parent;
            node.type = 'free';
            tree.listOfFree.push(node.id);
        }
    });
    // return tree.listOfFree;
}

node.prototype.isRightmostChild = function (nodelist) {
    if (this.id === 0) {
        return false;
    } else {
        var siblings = nodelist[this.parent].children;
        var rightmost = siblings[siblings.length - 1];
        var isRightmost = (this.id === rightmost);
        return isRightmost;
    }
};

function findLeftBracket(content, bra) {
    var pos;
    var long = '\\left' + bra;
    if (bra === '{') {
        long = '\\left\\{';
    }
    var minPos = -1;
    var braKind = 'nothing';
    pos = content.indexOf(long);
    var masked = content;
    if (pos >= 0) {
        minPos = pos;
        braKind = long;
        // mask all occurrencies of long
        var stop = false;
        pos = -1;
        do {
            pos = masked.indexOf(long, pos + 1);
            if (pos === -1) {
                stop = true;
            } else {
                var part1;
                if (pos > 0) {
                    part1 = masked.substring(0, pos - 1);
                } else {
                    part1 = '';
                }
                var part2 = '\\left@';
                if (bra === '\\{') {
                    part2 = '\\left\\@';
                }
                var part3 = masked.substring(pos + long.length);
                masked = part1 + part2 + part3;
            }
        } while (stop === false);
    }
    // All occurrencies of long are masked
    // Look for short bracket
    pos = masked.indexOf(bra);
    if (pos >= 0) {
        if (minPos === -1) {
            minPos = pos;
            braKind = bra;
        } else {
            if (pos < minPos) {
                minPos = pos;
                braKind = bra;
            }
        }
    }
    return [minPos, braKind];
}

function findLeftmostBracket(content) {
    var pos;
    var leftPos = -1;
    var braKind = 'nothing';
    var result = findLeftBracket(content, "(");
    pos = result[0];
    if (pos > -1) {
        if (leftPos === -1) {
            leftPos = pos;
            braKind = result[1];
        } else {
            if (pos < leftPos) {
                leftPos = pos;
                braKind = result[1];
            }
        }
    }
    // maybe there is a better (smaller) pos for a [ bracket
    result = findLeftBracket(content, '[');
    pos = result[0];
    if (pos > -1) {
        if (leftPos === -1) {
            leftPos = pos;
            braKind = result[1];
        } else {
            if (pos < leftPos) {
                leftPos = pos;
                braKind = result[1];
            }
        }
    }
    // maybe there is a better (smaller) pos for a { bracket
    result = findLeftBracket(content, '{');
    pos = result[0];
    if (pos > -1) {
        if (leftPos === -1) {
            leftPos = pos;
            braKind = result[1];
        } else {
            if (pos < leftPos) {
                leftPos = pos;
                braKind = result[1];
            }
        }
    }
    // maybe there is a better (smaller) pos for a | bracket
    result = findLeftBracket(content, '|');
    pos = result[0];
    if (pos > -1) {
        if (leftPos === -1) {
            leftPos = pos;
            braKind = result[1];
        } else {
            if (pos < leftPos) {
                leftPos = pos;
                braKind = result[1];
            }
        }
    }
    return [leftPos, braKind];
}

export function findCorrespondingRightBracket(content, bra) {
    var pos;
    pos = ['(', '[', '{', '|', '\\left(', '\\left[', '\\left\\{', '\\left|'].indexOf(bra);
    var rightbra;
    if (pos === -1) {
        rightbra = 'no bracket found error';
    } else {
        rightbra = [')', ']', '}', '|', '\\right)', '\\right]', '\\right\\}', '\\right|'][pos];
    }
    var stop = false;
    var mass = [];
    for (var i = 0; i < content.length; i++) {
        mass[i] = 0;
    }
    var leftPos = -1;
    var rightPos = -1;
    pos = -1;
    do {
        pos = content.indexOf(bra, pos + 1);
        if (pos === -1) {
            stop = true;
        } else {
            mass[pos] = 1;
            if (leftPos === -1) {
                leftPos = pos;
            }
        }
    } while (stop === false);
    pos = -1;
    stop = false;
    do {
        pos = content.indexOf(rightbra, pos + 1);
        if (pos === -1) {
            stop = true;
        } else {
            mass[pos] = -1;
        }
    } while (stop === false);
    // sum of masses
    for (i = 1; i < content.length; i++) {
        var sum = mass[i - 1] + mass[i];
        if (mass[i] === -1 && sum === 0) {
            rightPos = i;
            break;
        }
        mass[i] = sum;
    }
    return {
        leftPos: leftPos,
        bracketLength: bra.length,
        rightPos: rightPos,
        rightBracketLength: rightbra.length
    };
}

function removeOperators(tree, kindOfOperators) {
    var pos = -1;
    var opOne = '+';
    var opTwo = '-';
    if (kindOfOperators === 'equal') {
        opOne = '=';
        opTwo = '@%';
    }
    if (kindOfOperators === 'timesdivided') {
        opOne = '\\cdot';
        opTwo = ':';
    }
    if (kindOfOperators === 'invisibleTimes') {
        opOne = '*';
        opTwo = '@%';
    }
    // before power, \int has to be parsed
    if (kindOfOperators === 'power') {
        opOne = '^';
        opTwo = '@%';
    }
    // before sub, \int has to be parsed
    if (kindOfOperators === 'sub') {
        opOne = '_';
        opTwo = '@%';
    }
    var opOneLength = opOne.length;
    var opTwoLength = opTwo.length;
    withEachLeaf(tree, function (node) {
        var loop = true;
        do {
            var posOne = node.content.lastIndexOf(opOne);
            var posTwo = node.content.lastIndexOf(opTwo);
            var posOneFlag = false;
            if (posOne === -1 && posTwo === -1) {
                pos = -1;
            } else {
                if (posOne === -1) {
                    pos = posTwo;
                }
                if (posTwo === -1) {
                    pos = posOne;
                    posOneFlag = true;
                }
                if (posOne > -1 && posTwo > -1) {
                    pos = posOne;
                    posOneFlag = true;
                    if (posTwo > pos) {
                        pos = posTwo;
                        posOneFlag = false;
                    }
                }
            }

            if (pos === -1) {
                loop = false;
            } else {
                // found an operator opOne or opTwo in node[index]
                var leftpart, middlepart, rightpart;
                leftpart = node.content.substring(0, pos);
                if (posOneFlag) {
                    middlepart = node.content.substring(pos, pos + opOneLength);
                    rightpart = node.content.substring(pos + opOneLength);
                } else {
                    middlepart = node.content.substring(pos, pos + opTwoLength);
                    rightpart = node.content.substring(pos + opTwoLength);
                }
                // number of § markers
                var leftcount = (leftpart.match(/§/g) || []).length;
                var rightcount = (rightpart.match(/§/g) || []).length;
                var check = ((leftcount + rightcount) === node.children.length);
                if (node.type.startsWith('definite')) {
                    // children[0] = lowerBoundary, children[1] = upperBoundary
                    check = ((leftcount + rightcount) === node.children.length - 2);
                }
                if (check === false) {
                    ///throw('(remove operators) Wrong number of bracket markers');
                    console.warn('(remove operators) Wrong number of bracket markers');
                }
                var rememberchildren = node.children;
                var leftchildren, rightchildren;
                if (leftcount > 0) {
                    leftchildren = rememberchildren.slice(0, leftcount);
                } else {
                    leftchildren = [];
                }
                if (rightcount > 0) {
                    rightchildren = rememberchildren.slice(leftcount, rememberchildren.length);
                } else {
                    rightchildren = [];
                }
                var operator = createNode('plusminus', middlepart, tree);
                if (kindOfOperators === 'equal') {
                    operator.type = 'equal';
                }
                if (kindOfOperators === 'timesdivided') {
                    operator.type = 'timesdivided';
                }
                if (kindOfOperators === 'invisibleTimes') {
                    operator.type = '*';
                    operator.content = '';
                }
                if (kindOfOperators === 'power') {
                    operator.type = 'power';
                }
                if (kindOfOperators === 'sub') {
                    operator.type = 'sub';
                }
                var rest = createNode('leaf', rightpart, tree);
                if (rest.content == "") {
                    rest.content = "0";
                    rest.type = "invisible_zero";
                }
                var siblings = tree.nodelist[node.parent].children;
                var position = siblings.indexOf(node.id);

                // Upper connection: connect new node operator with former parent of node
                tree.nodelist[node.parent].children[position] = operator.id;
                operator.parent = node.parent;
                // Left and right connection: 
                // connect new node operator at left side with old node, but left part only
                // connect new node operator at right side with new node rest
                // Direction "up"
                node.content = leftpart;
                if (node.content == "") {
                    node.content = "0";
                    node.type = "invisible_zero";
                }
                node.parent = operator.id;
                rest.parent = operator.id;
                // Direction "down"
                operator.children = [node.id, rest.id];
                // children of node and rest have to be adjusted
                node.children = leftchildren;
                // node stays parent of left children: nothing to do
                rest.children = rightchildren;
                // node "rest" becomes parent of right children
                for (var i = 0; i < rightchildren.length; i++) {
                    tree.nodelist[rightchildren[i]].parent = rest.id;
                }
            }
        } while (loop == true);
    });
    // return tree.nodelist;
}

let parseTreeCounter = {
    counter: 0,

    getCounter() {
        return this.counter;
    },

    setCounter(value) {
        this.counter = value;
    },

    inc() {
        this.counter++;
    }
}

export function parseTreeByIndex(tree) {
    parseTreeCounter.inc();
    var endParse = false;
    var message = '';
   // var listOfFree;
    switch (parseTreeCounter.getCounter()) {
        case 1:
            message = 'delete spaces and remove backslash at \\min';
            // console.clear();
            tree.leaf.content = deleteSpaceAndRemoveBackslash(tree.leaf.content);
            tree.leaf.content = makeDegreeUnit(tree.leaf.content);
            break;
        case 2:
            message = 'parse brackets';
            parseBrackets(tree);
            break;
        case 3:
            message = 'parse equal';
            removeOperators(tree, 'equal');
            message = 'parse plusminus';
            removeOperators(tree, 'plusminus');
            break;
        case 4:
            message = 'parse timesdivided';
            removeOperators(tree, 'timesdivided');
            break;
        case 5:
            message = 'unify subscript and exponent (part 1)';
            unifySubExponent(tree);
            break;
        case 6:
            message = 'parse integral';
            parseIntegral(tree);
            break;
        case 7:
            message = 'parse square root / nth root';
            parseNthRoot(tree);
            parseSqrt(tree);
            break;
        case 8:
            message = 'parse log_base';
            parseLogLim(tree, 'log'); //log
            // check_children(tree);
            break;
        case 9:
            message = 'parse lim';
            parseLogLim(tree, 'lim'); //lim
            // check_children(tree);
            break;
        case 10:
            message = 'parse functions';
            parseFunction(tree);
            // check_children(tree);
            break;
        case 11:
            message = 'parse fractions';
            parseFrac(tree);
            break;
        case 12:
            message = 'parse textcolor (unit)';
            //check_children(tree);
            parseTextColor(tree);
            //check_children(tree);
            break;
        case 13:
            message = 'delete single § nodes'
            deleteSingleNodes(tree);
            break;
        case 14:
            message = 'parse greek';
            parseGreek(tree);
            break;
        case 15:
            message = 'parse numbers';
            parseNumbers(tree);
            break;
        case 16:
            message = 'delete single § nodes';
            deleteSingleNodes(tree);
            break;
        case 17:
            message = 'parse mixed numbers ';
            parseMixedNumbers(tree);
            break;
        case 18:
            message = 'unify subscript (part 2) '
            unifySubOrPower(tree, false);
            break;
        case 19:
            message = 'parse subscript'
            parseSubPower(tree, false);
            break;
        case 20:
            message = 'unify power (part 2) '
            unifySubOrPower(tree, true);
            break;
        case 21:
            message = 'parse power'
            parseSubPower(tree, true);
            break;
        case 22:
            message = 'delete single § nodes'
            deleteSingleNodes(tree);
            break;
        case 23:
            message = 'parse unit'
            parseUnit(tree);
            //check_children(tree);
            break;
        case 24:
            message = 'parse factors';
            parseFactors(tree);
            //check_children(tree);
            break;
        case 25:
            message = 'delete single § nodes';
            deleteSingleNodes(tree);
            break;
        default:
            message = 'end of parse';
            endParse = true;
    }
    return {
        message: message,
        endParse: endParse
    };
}

export default function parse(texstring) {
    var myTree = new FaTree();
    myTree.leaf.content = texstring;
    var endParse = false;
    parseTreeCounter.setCounter(0);
    while (!endParse) {
        var parseResult = parseTreeByIndex(myTree);
        endParse = parseResult.endParse;
        //paint_tree(tree, canvas, parseResult.message);
    }
    return myTree;
}

/**
 * deletes spaces and removes backslashes before 'min' or 'max'<br>
* 
 * @param {string} text latex string to be parsed 
 * @returns {string} beautified latex string
 * @example text = 'abc  def' returns 'abc def'
 * @example A backslash \ has to be escaped as \\ in regex expressions and javascript strings
 * @example text = '\min' returns 'min'
 * @example text = '\cdot' (no trailing space) returns '\cdot ' (1 space)
 * @example text = '\cdot  ' (2 spaces) returns '\cdot ' (1 space)
  */
function deleteSpaceAndRemoveBackslash(text) {
    // https://stackoverflow.com/questions/4025482/cant-escape-the-backslash-with-regex#4025505
    // http://www.javascripter.net/faq/backslashinregularexpressions.htm
    text = String(text);
    var temp = text.replace(/\\\s/g, '');
    temp = temp.replace(/\\min/g, 'min');
    temp = temp.replace(/\\max/g, 'max');
    // unify spaces after \\cdot
    temp = temp.replace(/\\cdot/g, '\\cdot '); // no space -> one space, but one space -> two spaces
    temp = temp.replace(/\\cdot {2}/g, '\\cdot '); // two spaces -> one space

    // temp = temp.replace(/\\Ohm/g, '\\Omega'); // transform unit Ohm to greek Omega. Done in preparePage.js
    return temp;
}

function makeDegreeUnit(text) {
    text = text.replace(/''/g, "↟");
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    // https://regex101.com/ online regex tester
    var regex = RegExp('((\\d+(\\.|\\,))?\\d+)([°\'↟]+)', 'g');
    // regex matches for example .45° 3,89' 17.5↟
    let result;
    let lastlastIndex = 0;
    let separator = '∱';
    let gaps = [separator];
    let number = [separator];
    let degree = [separator];

    var stop = false;
    do {
        if ((result = regex.exec(text)) !== null) {
            var gap = text.substring(lastlastIndex, result.index);
            if (gap !== "") {
                gaps.push(separator);
                number.push(separator);
                degree.push(separator);
            }
            gaps.push(gap);
            number.push(result[1]);
            degree.push(result[4]);
            lastlastIndex = regex.lastIndex;
        } else { // result == null
            stop = true;
        }
    } while (stop == false);

    // handle the end of text string
    gap = text.substring(lastlastIndex);
    gaps.push(gap);
    number.push('');
    degree.push('');

    var unitchain = degree.join('') + separator;


    var regex2 = []
    regex2.push(RegExp("∱°'↟∱", 'g'));
    regex2.push(RegExp("∱'↟∱", 'g'));
    regex2.push(RegExp("∱°↟∱", 'g'));
    regex2.push(RegExp("∱°'∱", 'g'));
    regex2.push(RegExp("∱°∱", 'g'));
    regex2.push(RegExp("∱'∱", 'g'));
    regex2.push(RegExp("∱↟∱", 'g'));

    for (var reg = 0; reg < regex2.length; reg++) {
        regex = regex2[reg];
        stop = false;
        do {
            if ((result = regex.exec(unitchain)) !== null) {
                var index = result.index + 1;
                switch (result[0].length) {
                    case 5:
                        // code block
                        gaps[index] += '{';
                        degree[index] += '+';
                        degree[index + 1] += '+';
                        degree[index + 2] += '}';
                        // var test = gaps[index] + '{' + number[index] + degree[index] + '+';
                        // test += gaps[index + 1] + number[index + 1] + degree[index + 1] + '+';
                        // test += gaps[index + 2] + number[index + 2] + degree[index + 2] + '}';
                        break;
                    case 4:
                        gaps[index] += '{';
                        degree[index] += '+';
                        degree[index + 1] += '}';
                        // var test = gaps[index] + '{' + number[index] + degree[index] + '+';
                        // test += gaps[index + 1] + number[index + 1] + degree[index + 1] + '}';
                        break;
                    case 3:
                        // var test = gaps[index] + number[index] + degree[index];
                        break;
                    default:
                        console.error('Error in texParser makeDegreeUnit');
                }
            } else { // result == null
                stop = true;
            }
        } while (stop == false);
    }

    //test
    var textWithBracketsAndPlus = '';
    for (var i = 0; i < degree.length; i++) {
        gap = gaps[i];
        if (gap !== separator) {
            textWithBracketsAndPlus += gap;
            textWithBracketsAndPlus += number[i];
            textWithBracketsAndPlus += degree[i];
        }
    }
    // var unit = "\\unit{";
    var unit = "\\textcolor{blue}{";
    var temp = textWithBracketsAndPlus.replace(/'/g, unit + "'}");
    temp = temp.replace(/°/g, unit + "°}");
    temp = temp.replace(/↟/g, unit + "''}");
    return temp;
}

function parseBrackets(tree) {
    withEachLeaf(tree, function (node) {
        var stop = false;
        do {
            var leftPos = node.addBracket(tree);
            if (leftPos == -1) {
                stop = true;
            }
        } while (stop === false)
    });
    return tree.nodelist;
}

function unifySubExponent(tree) {
    for (var needle of ['_', '^']) {
        withEachLeaf(tree, function (node) {
            var stop = false;
            var start = 0;
            do {
                var pos = node.content.indexOf(needle, start);
                if (pos < 0) {
                    stop = true;
                } else {
                    start = pos + 1;
                    var leftpart = node.content.substring(0, pos);
                    var leftCount = (leftpart.match(/§/g) || []).length;
                    var rest = node.content.substr(pos + 2);
                    // var predecessor = node.content.substr(pos - 1, 1);
                    var exponentOrSubScript = node.content.substr(pos + 1, 1);

                    // if (predecessor !== '§') {
                    //     newNode = createNode('leaf', predecessor, tree);
                    //     newNode.parent = node.id;
                    //     node.children.splice(leftCount, 0, newNode.id);
                    //     // for (var i = 0; i < node.children.length; i++) {
                    //                    //     // }
                    // }
                    // Now in any case predecessor equals '§'. 
                    // Number of § in leftpart+predecessor is one higher al old leftCount
                    // leftCount++;

                    if (exponentOrSubScript !== '§') {
                        var newNode = createNode('leaf', exponentOrSubScript, tree);
                        newNode.parent = node.id;
                        node.children.splice(leftCount, 0, newNode.id);
                        // for (var i = 0; i < node.children.length; i++) {
                        // }
                    }
                    node.content = leftpart + needle + '§' + rest;
                }
            } while (stop === false)
        });
    }
}

function parseIntegral(tree) {
    // for (var i = 0; i < listOfNodes.length; i++) {
    // does not fit because length of list changes
    withEachLeaf(tree, function (node) {
        var content = node.content;
        const needle = '\\int_§^§';
        var pos = content.indexOf(needle);
        if (pos > -1) {
            var left = node.content.substring(0, pos);
            var right = node.content.substring(pos + needle.length);
            var leftCount = (left.match(/§/g) || []).length;
            var rightCount = (right.match(/§/g) || []).length;
            // if there is no § in left, then leftCount = 0
            var newcontent = left + '§';
            // node has one § less! 
            node.content = newcontent;
            //check
            var lowerBound = tree.nodelist[node.children[leftCount]];
            var upperBound = tree.nodelist[node.children[leftCount + 1]];
            var integral = createNode('integral', '', tree);
            var integrand = createNode('leaf', right, tree);
            // last two characters
            var differential = right.substring(right.length - 2);
            if (differential.startsWith('d')) {
                // repair if differential is too short
                if (differential.length == 1) {
                    differential += 'x';
                }
                integrand.content = right.substr(0, right.length - 2);
                var diff = createNode('differential', differential, tree);
                //integral has four children 
                integral.children = [lowerBound.id, upperBound.id, integrand.id, diff.id];
                diff.parent = integral.id;
            } else {
                //integral has three children 
                integral.children = [lowerBound.id, upperBound.id, integrand.id];
            }

            // link integral
            integral.parent = node.id;
            // now the other directions
            lowerBound.parent = integral.id;
            upperBound.parent = integral.id;
            integrand.parent = integral.id;
            node.children[leftCount] = integral.id;
            node.children.splice(leftCount + 1, 1);
            for (var i = leftCount + 1; i <= leftCount + rightCount; i++) {
                var id = node.children[i];
                integrand.children.push(id);
                tree.nodelist[id].parent = integrand.id;
            }
            node.children.splice(leftCount + 1, rightCount);
        }
    });
}

function parseNthRoot(tree) {
    parseRadix(tree, true);
}

function parseSqrt(tree) {
    parseRadix(tree, false);
}

function parseRadix(tree, nthroot) {
    var needle = '\\sqrt§';
    if (nthroot === true) {
        needle = '\\sqrt§§';
    }

    withEachLeaf(tree, function (node) {
        var stop = false;
        do {
            var pos = node.content.indexOf(needle);
            if (pos > -1) {
                var left = node.content.substring(0, pos);
                var right = node.content.substring(pos + needle.length);
                var radIndex = (left.match(/§/g) || []).length;
                // if there is no § in left, then radIndex = 0
                var newcontent, radix;
                if (nthroot === true) {
                    newcontent = left + '§' + right;
                    // node has one § less! 
                    node.content = newcontent;
                    //check
                    // test = tree.nodelist[node.children[radIndex]].type;
                    // test = tree.nodelist[node.children[radIndex + 1]].type;
                    radix = createNode('nthroot', '', tree);
                    // link radix
                    radix.parent = node.id;
                    //radix has two children 
                    radix.children = [node.children[radIndex], node.children[radIndex + 1]];
                    // now the other directions
                    tree.nodelist[node.children[radIndex]].parent = radix.id;
                    tree.nodelist[node.children[radIndex + 1]].parent = radix.id;
                    node.children[radIndex] = radix.id;
                    node.children.splice(radIndex + 1, 1);
                } else {
                    newcontent = left + '§' + right;
                    //check
                    // test = tree.nodelist[node.children[radIndex]].type;
                    node.content = newcontent;
                    radix = createNode('sqrt', '', tree);
                    // link radix
                    radix.parent = node.id;
                    //radix has only one child
                    radix.children = [node.children[radIndex]];
                    // now the other directions
                    tree.nodelist[node.children[radIndex]].parent = radix.id;
                    node.children[radIndex] = radix.id;
                }
            } else {
                stop = true;
            }
        } while (stop === false)
    });
}

function parseLogLim(tree, kind) {
    var needle = '\\' + kind + '_§';
    withEachLeaf(tree, function (node) {
        var stop = false;
        do {
            var pos = node.content.indexOf(needle);
            if (pos > -1) {
                var left = node.content.substring(0, pos);
                var right = node.content.substring(pos + needle.length);
                var leftCount = (left.match(/§/g) || []).length;
                var rightCount = (right.match(/§/g) || []).length;
                // if there is no § in left, then leftCount = 0
                var newcontent = left + '§'; //right is moved to arg
                // node has one § less!
                node.content = newcontent;
                //check
                var base = tree.nodelist[node.children[leftCount]];
                var log = createNode('fu-' + kind, '', tree);
                var arg = createNode('leaf', right, tree);
                // link log
                log.parent = node.id;
                //log has two children 
                log.children = [base.id, arg.id];
                // now the other directions
                base.parent = log.id;
                arg.parent = log.id;
                node.children[leftCount] = log.id;
                for (var i = leftCount + 1; i < leftCount + 1 + rightCount; i++) {
                    arg.children.push(node.children[i]);
                    tree.nodelist[node.children[i]].parent = arg.id;
                }
                node.children.splice(leftCount + 1, rightCount);
            } else {
                stop = true;
            }
        } while (!stop)
    });
}

function functionList() {
    var result = ['sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'ln', 'lg', 'log', 'exp', 'abs', 'arcsin', 'arccos', 'arctan'];
    return result;
}

function parseFunction(tree) {
    // including function^exponent syntax, e.g. sin^2(x)
    withEachLeaf(tree, function (node) {
        var stop = false;
        var k = 0;
        var fu;
        do {
            fu = functionList()[k];
            var type = 'fu-' + fu;
            fu = '\\' + fu;
            var pos = node.content.indexOf(fu);
            if (pos > -1) {
                var leftpart = node.content.substring(0, pos);
                var leftCount = (leftpart.match(/§/g) || []).length;
                var rest = node.content.substring(pos + fu.length);
                var rightCount = (rest.match(/§/g) || []).length;
                var fuNode = createNode(type, '', tree);
                // link node <-> fuNode
                fuNode.parent = node.id;
                var remember = node.children[leftCount] || 0;
                node.children[leftCount] = fuNode.id;
                if (rest.startsWith('^§')) {
                    //fu-power
                    fuNode.content = 'power';
                    rest = rest.substring(2);
                    var arg = createNode('leaf', rest, tree);
                    fuNode.children[0] = remember;
                    tree.nodelist[remember].parent = fuNode.id;
                    fuNode.children[1] = arg.id;
                    arg.parent = fuNode.id;
                } else {
                    // no power:", "\\sin...
                    if (rest == '§') {
                        // \\sin§
                        fuNode.children[0] = remember;
                        tree.nodelist[remember].parent = fuNode.id;
                    } else {
                        //", "\\sin2\alpha
                        rest = rest.trim();
                        arg = createNode('leaf', rest, tree);
                        arg.parent = fuNode.id;
                        //fuNode.children[0] = remember;
                        fuNode.children[0] = arg.id;

                        for (var i = leftCount + 1; i <= leftCount + rightCount; i++) {
                            var id = node.children[i];
                            arg.children.push(id);
                            tree.nodelist[id].parent = arg.id;
                        }
                        node.children.splice(leftCount, rightCount);

                        //tree.nodelist[remember].parent = fuNode.id;
                        //arg.children[0] = remember;
                        //tree.nodelist[remember].parent = arg.id;
                    }
                }
                node.content = leftpart + '§';
            } else {
                // fu not found. Try next fu
                k++;
            }
            if (k >= functionList().length) {
                stop = true;
            }
        }
        while (stop === false);
    });

}

function parseFrac(tree) {
    const needle = '\\frac§§';
    withEachLeaf(tree, function (node) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            var pos = node.content.indexOf(needle);
            if (pos <= -1) break;
            var left = node.content.substring(0, pos);
            var right = node.content.substring(pos + needle.length);
            var fracIndex = (left.match(/§/g) || []).length; // = leftCount
            // if there is no § in left, then fracIndex = 0
            // node has one § less! 
            node.content = left + '§' + right;
            // check
            var test = tree.nodelist[node.children[fracIndex]].type;
            // eslint-disable-next-line no-unused-vars
            test = tree.nodelist[node.children[fracIndex + 1]].type;

            var fraction = createNode('frac', '', tree);
            // link fraction
            fraction.parent = node.id;
            //radix has two children 
            fraction.children = [node.children[fracIndex], node.children[fracIndex + 1]];
            // now the other directions
            tree.nodelist[node.children[fracIndex]].parent = fraction.id;
            tree.nodelist[node.children[fracIndex + 1]].parent = fraction.id;
            node.children[fracIndex] = fraction.id;
            node.children.splice(fracIndex + 1, 1);
        }
    });
}

function parseTextColor(tree) {
    const needle = '\\textcolor§§';
    withEachLeaf(tree, function (node) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            var pos = node.content.indexOf(needle);
            if (pos <= -1) break;
            var left = node.content.substring(0, pos);
            var right = node.content.substring(pos + needle.length);
            var unit_index = (left.match(/§/g) || []).length; // = leftCount
            // if there is no § in left, then unit_index = 0
            // node has one § less! 
            node.content = left + '§' + right;
            var bracket = tree.nodelist[node.children[unit_index]];
            // var test = tree.nodelist[node.children[unit_index + 1]].type;
            //check
            // fetch the color
            var colornode = tree.nodelist[bracket.children[0]];
            var color = colornode.content;
            var unit = createNode('unit', color, tree);
            // link unit
            unit.parent = node.id;
            //unit has one child 
            unit.children[0] = node.children[unit_index + 1];
            // now the other directions
            tree.nodelist[node.children[unit_index + 1]].parent = unit.id;
            node.children[unit_index] = unit.id;
            node.children.splice(unit_index + 1, 1);
            // delete two nodes
            bracket.type = 'free';
            tree.listOfFree.push(bracket.id);
            colornode.type = 'free';
            tree.listOfFree.push(colornode.id);
        }
    })
}

function greekList() {
    return ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
        "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi",
        "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega",
        "varepsilon", "vartheta", "varkappa", "varpi", "varrho", "varsigma", "varphi",
        "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
        "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi",
        "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega",
        "to", "infty"
    ];
}

function parseGreek(tree) {
    withEachLeaf(tree, function (node) {
        var k = 0;
        var pos = -1;
        do {
            var greek = '\\' + greekList()[k];
            pos = node.content.indexOf(greek);
            if (pos > -1) {
                var leftpart = node.content.substring(0, pos);
                var leftCount = (leftpart.match(/§/g) || []).length;
                var rest = node.content.substring(pos + greek.length);
                var greekNode = createNode('greek', greekList()[k], tree);
                // link node <-> greekNode
                greekNode.parent = node.id;
                node.children.splice(leftCount, 0, greekNode.id);
                node.content = leftpart + '§' + rest;
                // maybe use same k again 
            } else {
                k++;
            }
        } while (k <= greekList().length);
    });
}

function parseNumbers(tree) {
    withEachLeaf(tree, function (node) {
        var content = node.content.trim();
        // var regex = '\\d+((\\.|\\,)\\d+)?';
        var regex = '(\\d+(\\.|\\,))?\\d+';
        // backslash must be masked: \\
        var pos = content.search(regex);
        // if no number in content, pos=-1
        if (pos == 0) { //content starts with number
            var match = content.match(regex);
            var num = content.substr(0, match[0].length);
            var rest = content.substring(match[0].length);
            node.content = "§" + rest;
            var number = createNode("number", num, tree);
            number.value = num;
            number.parent = node.id;
            node.children.splice(0, 0, number.id)
        }
    })
}

function parseMixedNumbers(tree) {
    withEachLeaf(tree, function (node) {
        var content = node.content.trim();
        if (content.startsWith('§§')) {
            var child0 = tree.nodelist[node.children[0]];
            if (child0.type == 'number') {
                var child1 = tree.nodelist[node.children[1]];
                if (child1.type == 'frac') {
                    var nomBracket = tree.nodelist[child1.children[0]];
                    if (nomBracket.type == 'bracket-{') {
                        var nom = tree.nodelist[nomBracket.children[0]];
                    }
                    var denomBracket = tree.nodelist[child1.children[1]];
                    if (denomBracket.type == 'bracket-{') {
                        var denom = tree.nodelist[denomBracket.children[0]];
                    }
                    // TODO: try/catch
                    if (nom.type == 'number' && denom.type == 'number') {
                        var mixedNum = createNode('mixedNumber', '', tree);
                        // leaf node has one child less and is parent of mixedNum
                        node.content = node.content.substr(1);
                        node.children.shift();
                        node.children[0] = mixedNum.id;
                        mixedNum.parent = node.id;
                        // children of mixedNum are old child0 and child1 of node
                        mixedNum.children.push(child0.id);
                        child0.parent = mixedNum.id;
                        mixedNum.children.push(child1.id);
                        child1.parent = mixedNum.id;
                    }
                }
            }
        }
    })
}

function unifySubOrPower(tree, power) {
    var needle = '_§';
    if (power) {
        needle = '^§';
    }
    withEachLeaf(tree, function (node) {
        var start = 0;
        var nextnode = false;
        do {
            var pos = node.content.indexOf(needle, start);
            if (pos < 0) {
                nextnode = true;
            } else {
                start = pos + 1;
                var leftpart = node.content.substring(0, pos - 1);
                var leftCount = (leftpart.match(/§/g) || []).length;
                var base = node.content.substr(pos - 1, 1);
                var rest = node.content.substr(pos + 2);
                if (isInUnit(tree, node)) {
                    leftpart = '';
                    leftCount = 0;
                    base = node.content.substr(0, pos);
                }
                if (base !== '§') {
                    var newNode = createNode('leaf', base, tree);
                    newNode.parent = node.id;
                    node.children.splice(leftCount, 0, newNode.id);
                }
                node.content = leftpart + '§' + needle + rest;
            }
        } while (!nextnode)
    });
}

function parseSubPower(tree, power) {
    var needle = '§_§';
    var type = 'sub';
    if (power) {
        needle = '§^§';
        type = 'power';
    }
    withEachLeaf(tree, function (node) {
        var pos = -1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            pos = node.content.indexOf(needle);
            if (pos <= -1) break;
            var leftpart = node.content.substring(0, pos);
            var middlepart = node.content.substr(pos, 3);
            var rest = node.content.substr(pos + 3);
            var leftCount = (leftpart.match(/§/g) || []).length; //same for ^ and _
            var base = tree.nodelist[node.children[leftCount]];
            var exponentOrSubScript = tree.nodelist[node.children[leftCount + 1]];
            if (!power) {
                if (exponentOrSubScript.type.startsWith('bracket')) {
                    var child = tree.nodelist[exponentOrSubScript.children[0]];
                    if (child.type == 'leaf') {
                        child.type = 'text'; // avoid later "timification"
                    }
                }
            }
            if (middlepart !== needle) {
                console.error('Error in parseSubPower: ' + needle + ' not found');
            }
            var newNode = createNode(type, '', tree);
            newNode.parent = node.id;
            node.children.splice(leftCount, 2, newNode.id);
            node.content = leftpart + '§' + rest;
            newNode.children.push(base.id);
            base.parent = newNode.id;
            newNode.children.push(exponentOrSubScript.id);
            exponentOrSubScript.parent = newNode.id;
        }
    });
}

function parseUnit(tree) {
    withEachNode(tree, function (node) {
        node.value = 'u';
    });
    withEachLeaf(tree, function (node) {
        if (isInUnit(tree, node)) {
            var temp = decomposeUnit(node.content);
            node.value = temp[3];
        }
    });
}

function parseFactors(tree) {
    withEachLeaf(tree, function (node) {
        if (!isInUnit(tree, node)) {
            // no unit
            var content = node.content.trim();
            node.content = content;
            if (content == "") {
                content = "?";
            }
            if (content.length !== 1) {
                // abc -> a*b*c
                var contentWithTimes = content[0];
                for (var k = 1; k < content.length; k++) {
                    contentWithTimes += '*' + content[k];
                }
                node.content = contentWithTimes;
            }
        } else {
            // unit
            content = node.content.trim();
            if (decomposeUnit(content)[0] == false) {
                // try to separate rightmost (youngest) character
                var left = content.substr(0, content.length - 1);
                var right = content.substr(content.length - 1);
                if (decomposeUnit(left)[0] == true) { //left is Unit
                    if (decomposeUnit(right)[0] == true) { // right isUnit
                        node.content = left + "*" + right;
                    }
                }
            }
        }
    });
    //check_children(tree);
    removeOperators(tree, 'invisibleTimes');
    //check_children(tree);

    //check_children(tree);
}

function decomposeUnit(unitstring) {
    unitstring = unitstring.trim();
    var isUnit = false;
    // default 
    var prefix = '';
    var unit = 'dummy';
    var value = unit2value(unitstring);
    if (value == 'u') {
        if (unitstring.length > 1) {
            // attempt to separate prefix and unit
            prefix = unitstring.substr(0, 1);
            // preserve default value of var unit
            var rest = unitstring.substr(1);
            var power = prefix2power(prefix);
            if (power == 'u') {
                isUnit = false;
            } else {
                var temp = unit2value(rest);
                if (temp == 'u') {
                    isUnit = false;
                } else {
                    // success of separation
                    value = power * temp;
                    unit = rest;
                    isUnit = true;
                }
            }
        }
    } else {
        // length= 1. value exists. No separation necessary.
        // e.g. m, s, A,...
        unit = unitstring;
        isUnit = true;
    }
    if (isUnit == false) {
        prefix = '';
        value = 1;
        unit = '<unknown unit>';
    }
    return [isUnit, prefix, unit, value];
}

function prefix2power(needle) {
    let prefixes = "y__z__a__f__p__n__µ__mcd__hk__M__G__T__P__E__Z__Y";
    // let Mu = String.fromCharCode(956);
    var pos = prefixes.indexOf(needle);
    var power = 0;
    if (pos > -1) {
        power = Math.pow(10, pos - 24);
    } else {
        power = 'u';
    }
    return power;
}

function unit2value(unitname) {
    var valueOf = {
        // dummy values, phantasy 
        // do not matter for purpose of comparison
        "g": 7.003725611783e-2,
        "m": 5.933875512401e-1,
        "A": 8.049921777482e1,
        "s": 9.066344172904e-3,
        "mol": 3.904471947388e-4,
        "Celsius": 7.2209518210337e-3,
        "Kelvin": 8.573310992341e2,
        "one": 1
    }
    valueOf["min"] = 60 * valueOf["s"];
    valueOf["h"] = 60 * valueOf["min"];
    valueOf["d"] = 24 * valueOf["h"];
    valueOf["C"] = valueOf["A"] * valueOf["s"];
    valueOf["e"] = 1.60217648740e-19 * valueOf["C"];
    valueOf["N"] = 1000 * valueOf["g"] * valueOf["m"] / (valueOf["s"] * valueOf["s"]);
    valueOf["J"] = valueOf["N"] * valueOf["m"];
    valueOf["W"] = valueOf["J"] / valueOf["s"];
    valueOf["V"] = valueOf["W"] * valueOf["A"];
    valueOf["\\Omega"] = valueOf["V"] / valueOf["A"];
    valueOf["Pa"] = valueOf["N"] / (valueOf["m"] * valueOf["m"]);
    valueOf["bar"] = 100000 * valueOf["Pa"];
    valueOf["Liter"] = 0.001 * valueOf["m"] * valueOf["m"] * valueOf["m"];
    valueOf["l"] = valueOf["Liter"];
    valueOf["Ar"] = 100 * valueOf["m"] * valueOf["m"];
    valueOf["°C"] = valueOf["Celsius"];
    valueOf["°"] = valueOf["one"] * Math.PI / 180;
    valueOf["''"] = valueOf["°"] / 3600;
    valueOf["'"] = valueOf["°"] / 60;
    valueOf["K"] = valueOf["Kelvin"];
    valueOf["dag"] = 10 * valueOf["g"];
    var result = valueOf[unitname];
    if (typeof result == 'undefined') {
        result = 'u';
    }
    return result;
}


export function value(tree) {
    fillWithValues(tree);
    // temp = {temp.hasValue, temp.variableValueList}
    return evaluateTree(tree);
}

export function evaluateTree(filledTree) {
    // temp = {temp.hasValue, temp.variableValueList}
    // var hasValue = temp[0];
    // var hasValue = temp.hasValue;
    if (filledTree.hasValue) {
        return val(filledTree.root, filledTree);
    } else {
        return undefined;
    }
}

function val(node, tree) { // TODO: different name, too similar to function value?
    //recursive
    var fu, child0, child1, child2, temp;
    var children = node.children;
    var numberOfChildren = children.length;
    if (numberOfChildren == 0) {
        if (node.type == 'number') {
            temp = node.content.replace(',', '.');
            node.value = temp;
        }
        if (node.type == 'invisible_zero') {
            node.value = 0;
        }
        if (isInUnit(tree, node)) {
            temp = decomposeUnit(node.content);
            if (temp[0] == true) {
                node.value = temp[3];
            }
        }
    }
    if (numberOfChildren == 1) {
        child0 = tree.nodelist[children[0]];
        var arg = val(child0, tree);
        if (node.type.startsWith('bracket-') || node.type == 'root' || node.type == 'unit') {
            if (node.type == 'bracket-\\left|') {
                // absolute value
                node.value = Math.abs(arg);
            } else {
                // bracket
                node.value = arg;
            }
        } else {
            if (node.type.startsWith('fu-')) {
                fu = node.type.substr(3)
                node.value = trigonometry(fu, arg);
            }
        }
        if (node.type == 'sqrt') {
            node.value = Math.sqrt(arg);
        }
    }

    if (numberOfChildren == 2) {
        child0 = tree.nodelist[children[0]];
        child1 = tree.nodelist[children[1]];
        var ch0 = val(child0, tree);
        var ch1 = val(child1, tree);
        if (node.type == '*') {
            node.value = Number(ch0) * Number(ch1);
        }
        if (node.type == 'timesdivided') {
            if (node.content == '\\cdot') {
                node.value = Number(ch0) * Number(ch1);
            }
            if (node.content == ':') {
                node.value = Number(ch0) / Number(ch1);
            }
        }
        if (node.type == 'nthroot') {
            node.value = Math.pow(Number(ch1), (1 / Number(ch0)));
        }
        if (node.type == 'power') {
            node.value = Math.pow(Number(ch0), Number(ch1));
        }
        if (node.type == 'fu-log') {
            node.value = Math.log(Number(ch1)) / Math.log(Number(ch0));
        }
        if (node.type.startsWith('fu-') && node.content == 'power') {
            fu = node.type.substr(3)
            var base = trigonometry(fu, ch1);
            node.value = Math.pow(base, ch0)
        }
        if (node.type == 'mixedNumber') {
            node.value = Number(ch0) + Number(ch1);
        }
        if (node.type == 'plusminus') {
            if (node.content == '+') {
                node.value = Number(ch0) + Number(ch1);
            }
            if (node.content == '-') {
                node.value = Number(ch0) - Number(ch1);
            }
        }
        if (node.type == 'frac') {
            node.value = Number(ch0) / Number(ch1);
        }
        if (node.type == 'equal') {
            if (Number(ch1) !== 0) {
                node.value = Number(ch0) / Number(ch1);
            } else {
                node.value = (Number(ch0) + Math.PI) / (Number(ch1) + Math.PI);
            }
        }
    }
    if (numberOfChildren > 2) {
        child0 = tree.nodelist[children[0]];
        child1 = tree.nodelist[children[1]];
        child2 = tree.nodelist[children[2]];
        var dummy = val(child0, tree);
        dummy = val(child1, tree);
        // eslint-disable-next-line no-unused-vars
        dummy = val(child2, tree);
    }
    return node.value;
}

function trigonometry(fu, arg) {
    //'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'ln', 'lg', 'log', 'exp', 'abs'
    var result = 'u';
    if (fu == 'sinh') {
        result = Math.sinh(arg);
    }
    if (fu == 'cosh') {
        result = Math.cosh(arg);
    }
    if (fu == 'tanh') {
        result = Math.tanh(arg);
    }
    if (fu == 'sin') {
        result = Math.sin(arg);
    }
    if (fu == 'cos') {
        result = Math.cos(arg);
    }
    if (fu == 'tan') {
        result = Math.tan(arg);
    }
    // if (fu == 'ln' || fu == 'log') {
    if (fu == 'ln') {
        result = Math.log(arg);
    }
    if (fu == 'lg') {
        result = Math.log10(arg);
    }
    if (fu == 'exp') {
        result = Math.exp(arg);
    }
    if (fu == 'abs') {
        result = Math.abs(arg);
    }
    if (fu == 'arcsin') {
        result = Math.asin(arg);
    }
    if (fu == 'arccos') {
        result = Math.acos(arg);
    }
    if (fu == 'arctan') {
        result = Math.atan(arg);
    }
    return result;
}

export function fillWithValues(treeVar, list) {
    var random = (arguments.length == 1);
    // random = true: fillWithRandomValues
    // random = false: fill with values of variableValueList
    var valueList = [];
    // console.clear();
    var hasValue = true;
    treeVar.withEachNode = function (node) {
        if (node.type == 'integral') hasValue = false;
        if (node.type == 'lim') hasValue = false;
        if (node.type == 'text') hasValue = false;
    };
    if (hasValue) {
        withEachLeafOrGreek(treeVar, function (node) {
            if (isInUnit(treeVar, node)) {
                var temp = decomposeUnit(node.content);
                node.value = temp[3];
                //node.type = 'unit';
            }
        });
        var i = 0;
        do {
            var stop = false;
            var found = false;
            var nodelist = treeVar.nodelist;
            do {
                var node = nodelist[i];
                // doThis may add or delete nodes!
                if ((node.type == 'leaf' || node.type == 'greek') && (node.value == 'u')) {
                    // found leaf or greek with value undefined ('u')
                    found = true;
                    stop = true; //short circuit
                } else {
                    i++;
                }
                if (i === nodelist.length) {
                    stop = true;
                }
                if (found) {
                    var content = node.content;
                    if (random == true) {
                        // random = true -> fill with random value
                        // Box-Muller
                        var u1 = 2 * Math.PI * Math.random();
                        var u2 = -2 * Math.log(Math.random());
                        var value = 1000 * Math.cos(u1) * Math.sqrt(u2);
                    } else {
                        value = list[content];
                        if (typeof value == 'undefined') {
                            console.error('Variable in definition set but not in applet: ' + content);
                            stop = true;
                            i++;
                            hasValue = false;
                            found = false;
                        }
                    }
                    if (typeof value !== 'undefined') {
                        withEachLeafOrGreek(treeVar, function (node) {
                            if (node.value == 'u') {
                                if (node.content == content) {
                                    node.value = value;
                                }
                                if (node.content == '\\pi') {
                                    node.value = Math.PI;
                                    value = Math.PI;
                                }
                                if (node.content == 'e') {
                                    node.value = Math.E;
                                    value = Math.E;
                                }
                            }
                        });
                        valueList[content] = value;
                    }
                }
            } while (!stop);
        } while (found);
    }
    treeVar.hasValue = hasValue;
    treeVar.variableValueList = valueList;
}

export function checkScientificNotation(texstring) {
    var isScientific = false;
    // var regex =  RegExp('\\.?', 'g');
    var repl = texstring.replace(".", ",");
    repl = repl.replace("e", "*10^");
    repl = repl.replace("E", "*10^");
    repl = repl.replace("\\cdot", "*");
    repl = repl.replace(/\\ /g, '');
    // accept 'almost scientific' strings like 23, 23,4* 23,4*10^ 
    if (repl.endsWith(',')) {
        repl = repl.substr(0, repl.length - 1);
    }
    if (repl.endsWith('*')) {
        repl = repl.substr(0, repl.length - 1);
    }
    if (repl.endsWith('*1')) {
        repl = repl.substr(0, repl.length - 2);
    }
    if (repl.endsWith('*10')) {
        repl = repl.substr(0, repl.length - 3);
    }
    // repl is used by preparePage.makeAutoUnitstring
    var mantissa = repl;
    var exponent = ''; // default
    var pos = repl.indexOf('*10^');
    if (pos > -1) {
        mantissa = repl.substr(0, pos);
        exponent = repl.substr(pos + 4);
    } else {
        if (mantissa.startsWith('10^')) {
            exponent = mantissa.substr(3);
            mantissa = '';
        }
    }
    exponent = exponent.replace("{", "");
    exponent = exponent.replace("}", "");
    exponent = exponent.toString();
    // https://regex101.com/
    // var regex = RegExp('((\\d+\\,)?\\d+)', 'g');
    // console.clear();
    var regex = RegExp('((\\-)?((\\d+)?\\,)?(\\d+))');
    // https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
    var leftOk = false;
    var left = regex.exec(mantissa);
    if (left !== null) {
        if (mantissa == left[0]) {
            leftOk = true;
        }
    }
    var rightOk = false;
    var right = regex.exec(exponent);
    if (right !== null) {
        if (exponent == right[0]) {
            rightOk = true;
        }
    } else {
        // not existing exponent is always ok
        rightOk = true;
    }
    isScientific = (leftOk && rightOk);
    return {
        isScientific,
        mantissa,
        exponent
    };
}