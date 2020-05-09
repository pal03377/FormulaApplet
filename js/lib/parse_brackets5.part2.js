var counter = 0;

var traverseDepthFirstWithPrefix = function (prefix, callback, nodelist) {
    (function recurse(currentNode) {
        prefix(currentNode);
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(nodelist[currentNode.children[i]]);
        }
        callback(currentNode);
    })(nodelist[0]);
};
var traverseDepthFirst = function (callback, nodelist) {
    (function recurse(currentNode) {
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(nodelist[currentNode.children[i]]);
        }
        callback(currentNode);
    })(nodelist[0]);
};
var traverseRootFirst = function (callback, nodelist) {
    (function recurse(currentNode) {
        callback(currentNode);
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(nodelist[currentNode.children[i]]);
        }
    })(nodelist[0]);
};
var traverseSimple = function (callback, nodelist) {
    for (var i = 0; i < nodelist.length; i++) {
        var node = nodelist[i];
        callback(node);
    }
};

function parse_brackets(tree) {
    var list_of_nodes = tree.nodelist;
    var index_of_last_node = 0;
    var index = 0;
    var stop = false;
    do {
        var node = list_of_nodes[index];
        console.log('parsing brackets in ' + index + ': ' + node.content);
        var left_pos = node.addBracket(tree);
        index_of_last_node = tree.nodelist.length; // maybe changing -> no 'for loop' possible
        console.log('left_pos=' + left_pos + ' index_of_last_node =' + index_of_last_node);
        if (left_pos === -1) {
            index++;
            if (index >= index_of_last_node) {
                stop = true;
            }
        }
    } while (stop === false);
    return list_of_nodes;
}

function parse_frac(tree) {
    var list_of_nodes = tree.nodelist;
    for (var i = 0; i < list_of_nodes.length; i++) {
        var node = list_of_nodes[i];
        if (node.content === '\\frac§§' && node.children.length === 2) {
            // console.log('found", "\\\\\frac§§ at ' + node.id);
            node.type = 'frac';
            node.content = '';
        }
        //}
    }
};

function function_list() {
    var result = ['sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'ln', 'log', 'exp', 'textcolor'];
    return result;
};

function parse_function(tree) {
    var i = 0;
    // length of tree.nodelist may change -> 
    // do not use "for", but "do-while"
    do {
        var node = tree.nodelist[i];
        var stop_fu = false;
        var k = 0;
        var pos = -1;
        do {
            var fu = function_list()[k];
            var type = 'fu-' + fu;
            fu = '\\' + fu;
            if (node.type == 'leaf') {
                // console.log('searching for ' + fu + ' in ' + node.content);
                pos = node.content.indexOf(fu);
                if (pos > -1) {
                    var pow = '';
                    var leftpart = node.content.substring(0, pos);
                    var left_count = (leftpart.match(/§/g) || []).length;
                    var rest = node.content.substring(pos + fu.length);
                    var fu_node = create_node(type, '', tree);
                    // link node <-> fu_node
                    fu_node.parent = node.id;
                    console.log('left_count=' + left_count + 'id=' + node.id + ' children=' + node.children);
                    var remember = node.children[left_count] || 0;
                    //                console.log('remember1=' + remember);
                    node.children[left_count] = fu_node.id;
                    //                console.log('remember2=' + remember);
                    if (rest.startsWith('^')) {
                        //fu-power
                        fu_node.content = 'power';
                        rest = rest.substring(1);
                        console.log('found ' + fu + '^ at ' + node.id + ' rest=' + rest);
                        if (rest.startsWith('§')) {
                            //", "\\sin^§...
                            pow = '§';
                            rest = rest.substring(1);
                            if (rest.startsWith('§')) {
                                //", "\\sin^§§...
                                fu_node.children[0] = remember;
                                tree.nodelist[remember].parent = fu_node.id;
                                fu_node.children[1] = node.children[left_count + 1];
                                tree.nodelist[node.children[left_count + 1]].parent = fu_node.id;
                            } else {
                                //", "\\sin^§x
                                var arg = create_node('leaf', rest, tree);
                                fu_node.children[0] = remember;
                                tree.nodelist[remember].parent = fu_node.id;
                                fu_node.children[1] = arg.id;
                                arg.parent = fu_node.id;
                            }
                        } else {
                            //", "\\sin^3...
                            pow = rest.substr(0, 1);
                            rest = rest.substring(1);
                            if (rest.startsWith('§')) {
                                //", "\\sin^3§
                                var node_pow = create_node('leaf', pow, tree);
                                fu_node.children[0] = node_pow.id;
                                node_pow.parent = fu_node.id;
                                fu_node.children[1] = remember;
                                tree.nodelist[remember].parent = fu_node.id;
                            } else {
                                //", "\\sin^32\alpha
                                var node_pow = create_node('leaf', pow, tree);
                                var arg = create_node('leaf', rest, tree);
                                fu_node.children = [node_pow.id, arg.id];
                                node_pow.parent = fu_node.id;
                                arg.parent = fu_node.id;
                                //                           console.log('remember3=' + remember);
                            }
                        }
                        console.log('type=' + type + ' pow=' + pow + ' rest=' + rest);
                    } else {
                        // no power:", "\\sin...
                        if (rest.startsWith('§')) {
                            //", "\\sin§
                            fu_node.children[0] = remember;
                            tree.nodelist[remember].parent = fu_node.id;
                        } else {
                            //", "\\sin2\alpha
                            var arg = create_node('leaf', rest, tree);
                            fu_node.children[0] = arg.id;
                            arg.parent = fu_node.id;
                        }
                        console.log('found ' + fu + ' at ' + node.id + ' rest=' + rest);
                    }
                    node.content = leftpart + '§';
                }
            }

            k++;
            if (k >= function_list().length) {
                stop_fu = true;
            }
        } while (stop_fu === false);
        i++;
    } while (i < tree.nodelist.length);
};

function greek_list() {
    result = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta"];
    result = result.concat(["iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi"]);
    result = result.concat(["rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"]);
    result = result.concat(["varepsilon", "vartheta", "varkappa", "varpi", "varrho", "varsigma", "varphi"]);
    result = result.concat(["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"]);
    result = result.concat(["Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi"]);
    result = result.concat(["Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"]);
    return result;
}

function parse_greek(tree) {
    var i = 0;
    // length of tree.nodelist may change -> 
    // do not use "for", but "do-while"
    do {
        var node = tree.nodelist[i];
        if (node.type == 'leaf') {
            var stop_greek = false;
            var k = 0;
            var pos = -1;
            do {
                var greek = '\\' + greek_list()[k];
                // console.log('search for ' + greek);
                var type = 'greek';
                pos = node.content.indexOf(greek);
                if (pos > -1) {
                    var leftpart = node.content.substring(0, pos);
                    var left_count = (leftpart.match(/§/g) || []).length;
                    var rest = node.content.substring(pos + greek.length);
                    console.log('leftpart=' + leftpart + ' rest=' + rest + ' greek=' + greek);
                    var greek_node = create_node(type, greek_list()[k], tree);
                    // link node <-> greek_node
                    greek_node.parent = node.id;
                    console.log('left_count=' + left_count + 'id=' + node.id + ' children=' + node.children);
                    console.log(node.children.join());
                    node.children.splice(left_count, 0, greek_node.id);
                    console.log(node.children.join());
                    node.content = leftpart + '§' + rest;
                    // maybe use same k again 
                } else {
                    k++;
                }
                if (k > greek_list().length) {
                    stop_greek = true;
                }
            } while (stop_greek === false);
        }
        i++;
    } while (i < tree.nodelist.length);
};

function parse_numbers(tree) {
    var i = 0;
    // length of tree.nodelist may change -> 
    // do not use "for", but "do-while"
    do {
        var node = tree.nodelist[i];
        if (node.type == 'leaf') {
            var content = node.content;
            console.log('number leaf ' + content);
            // var regex = '\\d+((\\.|\\,)\\d+)?';
            var regex = '(\\d+(\\.|\\,))?\\d+';
            // backslash must be masked: \\
            var pos = content.search(regex);
            if (pos == 0) {
                var match = content.match(regex);
                var num = content.substr(0, match[0].length);
                var rest = content.substring(match[0].length);
                /**
                 if (rest.length > 0) {
                    var left = create_node("number", number, tree);
                    var right = create_node("leaf", rest, tree);
                    // linking
                    node.content = "*";
                    node.type = "invisible_times";
                    right.children = node.children;
                    node.children = [left.id, right.id];
                    left.parent = node.id;
                    right.parent = node.id;
                } else {
                    node.type = "number";
                }
                 * 
                 */
                node.content = "§" + rest;
                var number = create_node("number", num, tree);
                number.parent = node.id;
                node.children.splice(0, 0, number.id)
            }
        }
        i++;
    } while (i < tree.nodelist.length);
};

function parse_factors(tree) {
    var i = 0;
    // length of tree.nodelist may change -> 
    // do not use "for", but "do-while"
    do {
        var node = tree.nodelist[i];
        if (node.type == 'leaf') {
            var content = node.content.trim();
            console.log('factor leaf ' + content);
            if (content == "") {
                content = "?";
            }
            if (content.length == 1) {
                console.log('nothing to do');
            } else {
                // abc -> a*b*c
                var content_with_times = content[0];
                for (var k = 1; k < content.length; k++) {
                    content_with_times += '*' + content[k];
                }
                node.content = content_with_times;
                console.log('time-ified:' + content_with_times);
            }
        }
        i++;
    } while (i < tree.nodelist.length);
    remove_operators(tree, 'invisible_times')
};

function parse_integral(tree) {
    // for (var i = 0; i < list_of_nodes.length; i++) {
    // does not fit because length of list changes
    var i = 0;
    var stop = false;
    do {
        var node = tree.nodelist[i];
        var content = node.content;
        if (content.startsWith('\\int')) {
            console.log('******", "\\\int found at node # ' + node.id);
            var pos_sub = content.indexOf('_');
            var pos_pow = content.indexOf('^');
            var rest = '';
            console.log('sub found at ' + pos_sub + ' pow found at ' + pos_pow);
            if (pos_sub === -1 || pos_pow === -1) {
                // indefinite integral
                rest = content.substring(4); //remove", "\\\int = 4 chars
                node.type = 'indefinite_integral';
                console.log(node.type + ' ' + rest);
            } else {
                // definite integral
                var lower_bound = content.substring(pos_sub + 1, pos_pow);
                var upper_bound = content.substring(pos_pow + 1, pos_pow + 2);
                rest = content.substring(pos_pow + 2);
                console.log(lower_bound + ' ' + upper_bound + ' rest=' + rest);
                // for every *_bound which is no § an unshift of children[] is necessary
                // check # of §
                var lower_count = (lower_bound.match(/§/g) || []).length;
                if (lower_count === 0) {
                    // no bracket, new node needed
                    var lower = create_node('lower_bound', lower_bound, tree);
                    lower.parent = node.id;
                    //console.log('before unshift: node,children.length=' + node.children.length);
                    node.children.unshift(lower.id);
                    //console.log('after unshift: node,children.length=' + node.children.length);
                    // now children[0] is free
                    // node.children[0] = lower.id;
                } else {
                    // children[0] stays at ist place and contains id of bracket
                }
                // console.log('children=' + node.children);
                var upper_count = (upper_bound.match(/§/g) || []).length;
                if (upper_count === 0) {
                    var upper = create_node('upper_bound', upper_bound, tree);
                    upper.parent = node.id;
                    node.children.unshift(0); //dummy
                    // now children[0] is free, but we need children[1]
                    node.children[0] = node.children[1];
                    node.children[1] = upper.id;
                } // else do nothing
                console.log('children=' + node.children);
                // check # of brackets (§)
                var rest_count = (rest.match(/§/g) || []).length;
                if (node.children.length !== 2 + rest_count) {
                    throw ('(parse_integral) Wrong number of bracket markers');
                }

                node.type = 'definite_integral';
                node.content = rest;
                console.log(node.type);
                console.log('lower_bound=' + node.children[0] + ' upper_bound=' + node.children[1] + ' rest=' + node.content);
            }
        }
        // console.log('i=' + i + ' tree.nodelist.length=' + tree.nodelist.length + 'content=' + node.content);
        i++;
        if (i === tree.nodelist.length) {
            stop = true;
        }
    } while (stop === false);
};

function parse_sqrt(tree) {
    parse_radix(tree, false);
};

function parse_nthroot(tree) {
    parse_radix(tree, true);
};

function parse_radix(tree, nthroot) {
    var i = 0;
    var stop = false;
    var needle = '\\sqrt§';
    if (nthroot === true) {
        needle += '§';
    }
    do {
        var node = tree.nodelist[i];
        var pos = -1;
        if (node.type.startsWith('leaf')) {
            do {
                pos = node.content.indexOf(needle);
                if (pos > -1) {
                    var left = node.content.substring(0, pos);
                    var right = node.content.substring(pos + needle.length);
                    var rad_index = (left.match(/§/g) || []).length;
                    // if there is no § in left, then rad_index = 0
                    console.log(i + ' content=' + node.content + ' pos=' + pos);
                    console.log(' left=###' + left + '###' + ' right=###' + right + '###');
                    if (nthroot === true) {
                        var newcontent = left + '§' + right;
                        // node has one § less! 
                        console.log('new=' + newcontent);
                        node.content = newcontent;
                        //check
                        var test = tree.nodelist[node.children[rad_index]].type;
                        console.log(test + ' should be bracket-[');
                        test = tree.nodelist[node.children[rad_index + 1]].type;
                        console.log(test + ' should be bracket-{');
                        var radix = create_node('nthroot', '', tree);
                        // link radix
                        radix.parent = node.id;
                        //radix has two children 
                        radix.children = [node.children[rad_index], node.children[rad_index + 1]];
                        // now the other directions
                        tree.nodelist[node.children[rad_index]].parent = radix.id;
                        tree.nodelist[node.children[rad_index + 1]].parent = radix.id;
                        node.children[rad_index] = radix.id;
                        node.children.splice(rad_index + 1, 1);
                    } else {
                        var newcontent = left + '§' + right;
                        console.log('new=' + newcontent);
                        //check
                        var test = tree.nodelist[node.children[rad_index]].type;
                        console.log(test + ' should be bracket-{');
                        node.content = newcontent;
                        var radix = create_node('sqrt', '', tree);
                        // link radix
                        radix.parent = node.id;
                        //radix has only one child
                        radix.children = [node.children[rad_index]];
                        // now the other directions
                        tree.nodelist[node.children[rad_index]].parent = radix.id;
                        node.children[rad_index] = radix.id;
                    }
                }
            } while (pos > -1);
        }
        i++;
        if (i === tree.nodelist.length) {
            stop = true;
        }
    } while (stop === false);
}

function parsetree_by_index(tree, canvas) {
    counter++;
    var end_parse = false;
    // console.log('switch to ' + counter)
    // console.log(tree);
    switch (counter) {
        case 1:
            console.clear();
            var temp = tree.leaf.content;
            // https://stackoverflow.com/questions/4025482/cant-escape-the-backslash-with-regex#4025505
            // http://www.javascripter.net/faq/backslashinregularexpressions.htm
            tree.leaf.content = temp.replace(/\\\s/g, '');
            break;
        case 2:
            console.log('parse brackets');
            result = parse_brackets(tree);
            break;
        case 3:
            console.log('parse plusminus');
            result = remove_operators(tree, 'plusminus');
            break;
        case 4:
            console.log('parse timesdivided');
            result = remove_operators(tree, 'timesdivided');
            break;
        case 5:
            console.log('parse integral');
            parse_integral(tree);
            break;
        case 6:
            console.log('parse square root / nth root');
            parse_nthroot(tree);
            parse_sqrt(tree);
            break;
        case 7:
            console.log('parse functions');
            parse_function(tree);
            break;
        case 8:
            console.log('parse greek');
            parse_greek(tree);
            break;
        case 9:
            console.log('parse power');
            result = remove_operators(tree, 'power');
            break;
        case 10:
            console.log('parse subscripts');
            result = remove_operators(tree, 'sub');
            break;
        case 11:
            var list_of_free = delete_single_nodes(tree);
            break;
        case 12:
            console.log('parse fractions');
            parse_frac(tree);
            break;
        case 13:
            console.log('parse numbers');
            parse_numbers(tree);
            break;
        case 14:
            console.log('parse factors');
            parse_factors(tree);
            break;
        case 15:
            console.log('delete single § nodes');
            var list_of_free = delete_single_nodes(tree);
            break;
        default:
            console.log('end of parse');
            end_parse = true;
    }
    var context = canvas.getContext("2d");
    paint_tree(tree, canvas, context);
    return end_parse;
}

// https://hackernoon.com/lets-make-a-javascript-wait-function-fa3a2eb88f11

function parse(tree) {
    // console.clear();
    // var temp = tree.leaf.content;
    // // https://stackoverflow.com/questions/4025482/cant-escape-the-backslash-with-regex#4025505
    // // http://www.javascripter.net/faq/backslashinregularexpressions.htm
    // tree.leaf.content = temp.replace(/\\\s/g, '');
    // waitaLitteBit(tree);
    // console.log('parse brackets');
    // result = parse_brackets(tree);
    // waitaLitteBit(tree);
    // //    traverseSimple(
    // //            function (node) {
    // //                node.debug(tree.nodelist);
    // //            }, tree.nodelist);
    // console.log('parse plusminus');
    // result = remove_operators(tree, 'plusminus');
    // waitaLitteBit(tree);

    //    traverseSimple(
    //            function (node) {
    //                node.debug(tree.nodelist);
    //            }, tree.nodelist);
    // console.log('parse timesdivided');
    // result = remove_operators(tree, 'timesdivided');
    // waitaLitteBit(tree);
    //    traverseSimple(
    //            function (node) {
    //                node.debug(tree.nodelist);
    //            }, result);
    //
    // console.log('parse integral');
    // parse_integral(tree);
    // waitaLitteBit(tree);
    // console.log('parse square root / nth root');
    // parse_nthroot(tree);
    // waitaLitteBit(tree);
    // parse_sqrt(tree);
    // waitaLitteBit(tree);
    //traverseDepthFirst(
    // traverseSimple(
    //     function (node) {
    //         node.debug(tree.nodelist);
    //     }, tree.nodelist);
    // console.log('parse functions');
    // parse_function(tree);
    // waitaLitteBit(tree);
    // console.log('parse greek');
    // parse_greek(tree);
    // waitaLitteBit(tree);
    // console.log('parse power');
    // result = remove_operators(tree, 'power');
    // waitaLitteBit(tree);
    // //    traverseSimple(
    //            function (node) {
    //                node.debug(tree.nodelist);
    //            }, tree.nodelist);
    // console.log('parse subscripts');
    // result = remove_operators(tree, 'sub');
    // waitaLitteBit(tree);
    // var list_of_free = delete_single_nodes(tree);
    // waitaLitteBit(tree);
    // console.log('parse fractions');
    // parse_frac(tree);
    // waitaLitteBit(tree);
    // console.log('parse numbers');
    // parse_numbers(tree);
    // waitaLitteBit(tree);
    /**
    traverseSimple(
        function (node) {
            node.debug(tree.nodelist);
        }, tree.nodelist);
    console.log('parse factors');
    */
    // parse_factors(tree);
    // waitaLitteBit(tree);
    /**
    traverseSimple(
        function (node) {
            node.debug(tree.nodelist);
        }, tree.nodelist);
    */
    // console.log('delete single § nodes');
    // var list_of_free = delete_single_nodes(tree);
    // waitaLitteBit(tree);
    // console.log('end of parse');
    // traverseSimple(
    //     function (node) {
    //         node.debug(tree.nodelist);
    //     }, tree.nodelist);

    var end_parse = false;
    while (!end_parse) {
        end_parse = parsetree_by_index(tree, canvas);
    }

    // tree.withEachNode(function (node) {
    //     console.log(node.id);
    // })
};

function tree2TEX(tree) {
    var depth = 0;
    return recurse(tree.root);

    function recurse(node) {
        var number_of_childs = (node.children || []).length;
        // console.log('children=' + node.children);
        depth++;
        var res = [];
        for (var i = 0; i < number_of_childs; i++) {
            var child = tree.nodelist[node.children[i]];
            res[i] = recurse(child);
        }
        var done = false;
        if (number_of_childs === 0) {
            // leaf
            result = node.content;
        }
        if (number_of_childs === 1) {
            if (node.type.startsWith('root')) {
                result = res[0];
                done = true;
            }
            if (node.type.startsWith('bracket')) {
                result = node.type.substring(8);
                var pos = ['(', '[', '{', '\\left(', '\\left[', '\\left\\{'].indexOf(result);
                if (pos === -1) {
                    var rightbra = 'no corresponding bracket found error';
                } else {
                    var rightbra = [')', ']', '}', '\\right)', '\\right]', '\\right\\}'][pos];
                }
                result += res[0];
                result += rightbra;
                done = true;
            }
            if (node.type.startsWith('sqrt')) {
                result = '\\sqrt';
                result += res[0];
                done = true;
            }
            if (!done) {
                result = res[0];
            }
        }
        if (number_of_childs >= 2) {
            var binaryoperator = false;
            if (node.type.startsWith('plusminus') || node.type.startsWith('timesdivided')) {
                binaryoperator = true;
            }
            if (node.type.startsWith('power') || node.type.startsWith('sub')) {
                binaryoperator = true;
            }
            if (binaryoperator) {
                result = res[0];
                result += node.content;
                result += res[1];
                done = true;
            }
            if ((!done) && node.type.startsWith('frac')) {
                result = '\\frac';
                result += res[0];
                result += res[1];
                done = true;
            }
            if ((!done) && node.type.startsWith('nthroot')) {
                result = '\\sqrt';
                result += res[0];
                result += res[1];
                done = true;
            }
            if (node.type.startsWith('definite_integral')) {
                result = '\\int_';
                result += res[0];
                result += '^';
                result += res[1];
                result += res[2];
                done = true;
            }
        }
        if (done === false) {
            // handle bracket childs (maybe 1 or 2 or even more)
            var pos = -1;
            var count = 0;
            var temp = node.content;
            // Do not change node.content. Use temp instead.
            do {
                pos = temp.indexOf('§');
                if (pos > -1) {
                    // console.log(node.id + ' ' + temp + ' ' + count + ' from ' + node.children);
                    var left = temp.substring(0, pos);
                    var right = temp.substring(pos + 1);
                    var middle = res[count];
                    // console.log(left + '::' + middle + '::' + right);
                    temp = left;
                    temp += middle;
                    temp += right;
                    count++;
                }
            } while (pos > -1)
            result = temp;
        }

        depth--;
        // console.log(node.id + '-----------------------'.slice(0, 2 * depth) + result);
        // console.log('(' + depth + ') ' + result);
        return result;
    }
};

col = 0;

function paint_tree(tree, canvas, context) {
    col = "#ffffdf";
    context.fillStyle = col;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '7pt Consolas';
    paint_tree_recurse(tree.root, tree.nodelist, -9999, -9999, 0, 0, context, 1);
};

function paint_tree_callback(currentNode, xa, ya, x, y, ctx) {
    // console.log(currentNode.id + '::' + currentNode.children);
    // console.log(xa + ' ' + ya + ' ' + x + ' ' + y);
    if (xa > -9999) {
        //        var xf = 600;
        var xf = ctx.canvas.width / 2 - 100;
        var yf = 40;
        var xt = ctx.canvas.width / 2;
        var yt = 30;
        xxa = xa * xf + xt;
        yya = ya * yf + yt;
        xx = x * xf + xt;
        yy = y * yf + yt - 5;
        //console.log(xxa + ' ' + yya + ' ' + xx + ' ' + yy);
        ctx.beginPath();
        ctx.moveTo(xxa, yya);
        ctx.lineTo(xx, yy);
        ctx.stroke();
        ctx.fillStyle = "#5050ff";
        ctx.fillText(currentNode.type, xx + 2, yy);
        ctx.fillStyle = "#ff5050";
        ctx.fillText(currentNode.content, xx + 2, yy + 10);
    }
};

function paint_tree_recurse(currentNode, nodelist, xa, ya, x, y, ctx, factor) {
    paint_tree_callback(currentNode, xa, ya, x, y, ctx);
    var xa = x;
    var ya = y;
    factor = factor * 0.75;
    var cnchl = currentNode.children.length;
    for (var i = 0, length = cnchl; i < length; i++) {
        paint_tree_recurse(nodelist[currentNode.children[i]], nodelist, xa, ya, xa + factor * (i - 0.5 * (cnchl - 1)), y + 1, ctx, factor);
    }
};