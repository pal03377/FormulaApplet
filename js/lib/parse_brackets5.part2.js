var counter = 0;

function parsetree_init() {
    counter = 0;
}

function parsetree_by_index(tree) {
    counter++;
    var end_parse = false;
    // console.log('switch to ' + counter)
    // console.log(tree);
    var message = '';
    switch (counter) {
        case 1:
            message = 'delete spaces';
            console.clear();
            var temp = tree.leaf.content;
            // https://stackoverflow.com/questions/4025482/cant-escape-the-backslash-with-regex#4025505
            // http://www.javascripter.net/faq/backslashinregularexpressions.htm
            tree.leaf.content = temp.replace(/\\\s/g, '');
            break;
        case 2:
            message = 'parse brackets';
            result = parse_brackets(tree);
            break;
        case 3:
            message = 'parse plusminus';
            result = remove_operators(tree, 'plusminus');
            break;
        case 4:
            message = 'parse timesdivided';
            result = remove_operators(tree, 'timesdivided');
            break;
        case 5:
            message = 'unify subscript and exponent (part 1)';
            unify_sub_exponent(tree);
            break;
        case 6:
            message = 'parse integral';
            parse_integral(tree);
            break;
        case 7:
            message = 'parse square root / nth root';
            parse_nthroot(tree);
            parse_sqrt(tree);
            break;
        case 8:
            message = 'parse log with base';
            parse_log(tree);
            break;
        case 9:
            message = 'parse functions';
            parse_function(tree);
            break;
        case 10:
            message = 'parse fractions';
            parse_frac(tree);
            break;
        case 11:
            message = 'delete single § nodes'
            var list_of_free = delete_single_nodes(tree);
            break;
        case 12:
            message = 'parse greek';
            parse_greek(tree);
            break;
        case 13:
            message = 'parse numbers';
            parse_numbers(tree);
            break;
        case 14:
            message = 'delete single § nodes'
            var list_of_free = delete_single_nodes(tree);
            break;
        case 15:
            message = 'unify subscript (part 2) '
            unify_sub_or_power(tree, false);
            break;
        case 16:
            message = 'parse subscript'
            parse_sub_power(tree, false);
            break;
        case 17:
            message = 'unify power (part 2) '
            unify_sub_or_power(tree, true);
            break;
        case 18:
            message = 'parse power'
            parse_sub_power(tree, true);
            break;
        case 19:
            message = 'delete single § nodes'
            var list_of_free = delete_single_nodes(tree);
            break;
        case 20:
            message = 'parse factors';
            parse_factors(tree);
            break;
        case 21:
            message = 'delete single § nodes';
            var list_of_free = delete_single_nodes(tree);
            break;
        default:
            message = 'end of parse';
            end_parse = true;
    }
    return [message, end_parse];
}

function parse(tree) {
    var end_parse = false;
    parsetree_init();
    while (!end_parse) {
        var temp = parsetree_by_index(tree);
        var message = temp[0];
        console.log('parse: ' + message);
        end_parse = temp[1];
        //paint_tree(tree, canvas, message);
    }
}

function parse_brackets(tree) {
    var list_of_nodes = tree.nodelist;
    var index_of_last_node = 0;
    var index = 0;
    var stop = false;
    do {
        var node = list_of_nodes[index];
        // console.log('parsing brackets in ' + index + ': ' + node.content);
        var left_pos = node.addBracket(tree);
        index_of_last_node = tree.nodelist.length; // maybe changing -> no 'for loop' possible
        // console.log('left_pos=' + left_pos + ' index_of_last_node =' + index_of_last_node);
        if (left_pos === -1) {
            index++;
            if (index >= index_of_last_node) {
                stop = true;
            }
        }
    } while (stop === false);
    return list_of_nodes;
}

function function_list() {
    var result = ['sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'ln', 'lg', 'log', 'exp', 'textcolor'];
    return result;
}

function parse_function(tree) {
    // including function^exponent syntax, e.g. sin^2(x)

    tree.withEachLeaf(function (node) {
        var stop_fu = false;
        var k = 0;
        do {
            var fu = function_list()[k];
            var type = 'fu-' + fu;
            fu = '\\' + fu;
            pos = node.content.indexOf(fu);
            if (pos > -1) {
                var pow = '';
                var leftpart = node.content.substring(0, pos);
                var left_count = (leftpart.match(/§/g) || []).length;
                var rest = node.content.substring(pos + fu.length);
                var fu_node = create_node(type, '', tree);
                // link node <-> fu_node
                fu_node.parent = node.id;
                console.log('left_count=' + left_count + ' id=' + node.id + ' children=' + node.children);
                var remember = node.children[left_count] || 0;
                console.log('remember=' + remember);
                node.children[left_count] = fu_node.id;
                if (rest.startsWith('^§')) {
                    //fu-power
                    fu_node.content = 'power';
                    rest = rest.substring(2);
                    console.log('found ' + fu + '^§ (power) at ' + node.id + ' rest=' + rest);
                    var arg = create_node('leaf', rest, tree);
                    fu_node.children[0] = remember;
                    tree.nodelist[remember].parent = fu_node.id;
                    fu_node.children[1] = arg.id;
                    arg.parent = fu_node.id;
                    console.log('type=' + type + ' rest=' + rest);
                } else {
                    // no power:", "\\sin...
                    console.log('found ' + fu + ' at ' + node.id + ' rest=' + rest);
                    if (rest.startsWith('§')) {
                        // \\sin§
                        fu_node.children[0] = remember;
                        tree.nodelist[remember].parent = fu_node.id;
                    } else {
                        //", "\\sin2\alpha
                        var arg = create_node('leaf', rest, tree);
                        arg.parent = fu_node.id;
                        //fu_node.children[0] = remember;
                        fu_node.children[0] = arg.id;
                        //tree.nodelist[remember].parent = fu_node.id;
                    }
                }
                node.content = leftpart + '§';
            } else {
                // fu not found. Try next fu
                k++;
            }
            if (k >= function_list().length) {
                stop_fu = true;
            }
        }
        while (stop_fu === false);
    });

    // var i = 0;
    // // length of tree.nodelist may change -> 
    // // do not use "for", but "do-while"
    // do {
    //     var node = tree.nodelist[i];
    //     var stop_fu = false;
    //     var k = 0;
    //     var pos = -1;
    //     do {
    //         var fu = function_list()[k];
    //         var type = 'fu-' + fu;
    //         fu = '\\' + fu;
    //         if (node.type == 'leaf') {
    //             // console.log('searching for ' + fu + ' in ' + node.content);
    //             pos = node.content.indexOf(fu);
    //             if (pos > -1) {
    //                 var pow = '';
    //                 var leftpart = node.content.substring(0, pos);
    //                 var left_count = (leftpart.match(/§/g) || []).length;
    //                 var rest = node.content.substring(pos + fu.length);
    //                 var fu_node = create_node(type, '', tree);
    //                 // link node <-> fu_node
    //                 fu_node.parent = node.id;
    //                 console.log('left_count=' + left_count + 'id=' + node.id + ' children=' + node.children);
    //                 var remember = node.children[left_count] || 0;
    //                 //                console.log('remember1=' + remember);
    //                 node.children[left_count] = fu_node.id;
    //                 //                console.log('remember2=' + remember);
    //                 var basenode = null;
    //                 if (type == 'fu-log') {
    //                     console.log('fu-log rest=' + rest);
    //                     if (rest.startsWith('_')) {
    //                         rest = rest.substring(1);
    //                         if (rest.startsWith('§')) {
    //                             // log_§
    //                             basenode = '§';
    //                         } else {
    //                             var base = rest.substr(0, 1);
    //                             rest = '§' + rest.substring(1);
    //                             basenode = create_node('leaf', base, tree);
    //                             basenode.parent = fu_node.id;
    //                         }
    //                     }
    //                 }
    //                 if (rest.startsWith('^')) {
    //                     //fu-power
    //                     fu_node.content = 'power';
    //                     rest = rest.substring(1);
    //                     console.log('found ' + fu + '^ at ' + node.id + ' rest=' + rest);
    //                     if (rest.startsWith('§')) {
    //                         //", "\\sin^§...
    //                         pow = '§';
    //                         rest = rest.substring(1);
    //                         if (rest.startsWith('§')) {
    //                             //", "\\sin^§§...
    //                             fu_node.children[0] = remember;
    //                             tree.nodelist[remember].parent = fu_node.id;
    //                             fu_node.children[1] = node.children[left_count + 1];
    //                             tree.nodelist[node.children[left_count + 1]].parent = fu_node.id;
    //                         } else {
    //                             //", "\\sin^§x
    //                             var arg = create_node('leaf', rest, tree);
    //                             fu_node.children[0] = remember;
    //                             tree.nodelist[remember].parent = fu_node.id;
    //                             fu_node.children[1] = arg.id;
    //                             arg.parent = fu_node.id;
    //                         }
    //                     } else {
    //                         //", "\\sin^3...
    //                         pow = rest.substr(0, 1);
    //                         rest = rest.substring(1);
    //                         if (rest.startsWith('§')) {
    //                             //", "\\sin^3§
    //                             var node_pow = create_node('leaf', pow, tree);
    //                             fu_node.children[0] = node_pow.id;
    //                             node_pow.parent = fu_node.id;
    //                             fu_node.children[1] = remember;
    //                             tree.nodelist[remember].parent = fu_node.id;
    //                         } else {
    //                             //", "\\sin^32\alpha
    //                             var node_pow = create_node('leaf', pow, tree);
    //                             var arg = create_node('leaf', rest, tree);
    //                             fu_node.children = [node_pow.id, arg.id];
    //                             node_pow.parent = fu_node.id;
    //                             arg.parent = fu_node.id;
    //                             //                           console.log('remember3=' + remember);
    //                         }
    //                     }
    //                     console.log('type=' + type + ' pow=' + pow + ' rest=' + rest);
    //                 } else {
    //                     // no power:", "\\sin...
    //                     var arg = create_node('leaf', rest, tree);
    //                     arg.parent = fu_node.id;
    //                     if (rest.startsWith('§')) {
    //                         //", "\\sin§
    //                         // fu_node.children[0] = remember;
    //                         // tree.nodelist[remember].parent = fu_node.id;
    //                         // if (basenode !== null){
    //                         //     fu_node.children[1] = basenode.id;
    //                         // }
    //                         if (basenode !== null) {
    //                             fu_node.children[0] = basenode.id;
    //                             fu_node.children[1] = arg.id;
    //                         }
    //                     } else {
    //                         //", "\\sin2\alpha
    //                         fu_node.children[0] = arg.id;
    //                     }
    //                     console.log('found ' + fu + ' at ' + node.id + ' rest=' + rest);
    //                 }
    //                 node.content = leftpart + '§';
    //             }
    //         }

    //         k++;
    //         if (k >= function_list().length) {
    //             stop_fu = true;
    //         }
    //     } while (stop_fu === false);
    //     i++;
    // } while (i < tree.nodelist.length);
}

function parse_frac(tree) {
    needle = '\\frac§§';
    tree.withEachNode(function (node) {
        var stop = false;
        do {
            pos = node.content.indexOf(needle);
            if (pos > -1) {
                var left = node.content.substring(0, pos);
                var right = node.content.substring(pos + needle.length);
                var frac_index = (left.match(/§/g) || []).length;
                // if there is no § in left, then frac_index = 0
                console.log(i + ' content=' + node.content + ' pos=' + pos);
                console.log(' left=###' + left + '###' + ' right=###' + right + '###');
                // node has one § less! 
                node.content = left + '§' + right;
                console.log('new=' + node.content);
                //check
                var test = tree.nodelist[node.children[frac_index]].type;
                console.log(test + ' should be bracket-{');
                test = tree.nodelist[node.children[frac_index + 1]].type;
                console.log(test + ' should be bracket-{');

                var fraction = create_node('frac', '', tree);
                // link fraction
                fraction.parent = node.id;
                //radix has two children 
                fraction.children = [node.children[frac_index], node.children[frac_index + 1]];
                // now the other directions
                tree.nodelist[node.children[frac_index]].parent = fraction.id;
                tree.nodelist[node.children[frac_index + 1]].fraction = fraction.id;
                node.children[frac_index] = fraction.id;
                node.children.splice(frac_index + 1, 1);
            } else {
                stop = true;
            }
        } while (stop === false)
    })
}

function greek_list() {
    result = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta"];
    result = result.concat(["iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi"]);
    result = result.concat(["rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"]);
    result = result.concat(["varepsilon", "vartheta", "varkappa", "varpi", "varrho", "varsigma", "varphi"]);
    result = result.concat(["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"]);
    result = result.concat(["Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi"]);
    result = result.concat(["Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"]);
    result = result.concat(["infty"]);
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
                    // console.log('leftpart=' + leftpart + ' rest=' + rest + ' greek=' + greek);
                    var greek_node = create_node(type, greek_list()[k], tree);
                    // link node <-> greek_node
                    greek_node.parent = node.id;
                    // console.log('left_count=' + left_count + 'id=' + node.id + ' children=' + node.children);
                    // console.log(node.children.join());
                    node.children.splice(left_count, 0, greek_node.id);
                    // console.log(node.children.join());
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
}

function unify_sub_exponent(tree) {
    for (var needle of ['_', '^']) {
        tree.withEachNode(function (node) {
            var nextnode = false;
            var start = 0;
            do {
                if (node.type == 'leaf') {
                    // console.log('parsing ' + node.content + ' with ' + needle);
                    var pos = node.content.indexOf(needle, start);
                    if (pos < 0) {
                        nextnode = true;
                    } else {
                        start = pos + 1;
                        var leftpart = node.content.substring(0, pos);
                        var left_count = (leftpart.match(/§/g) || []).length;
                        var rest = node.content.substr(pos + 2);
                        // var predecessor = node.content.substr(pos - 1, 1);
                        var exponent_or_subscript = node.content.substr(pos + 1, 1);
                        console.log(leftpart + ' | ' + needle + exponent_or_subscript + ' | ' + rest + ' left_count=' + left_count);

                        // if (predecessor !== '§') {
                        //     new_node = create_node('leaf', predecessor, tree);
                        //     new_node.parent = node.id;
                        //     node.children.splice(left_count, 0, new_node.id);
                        //     // for (var i = 0; i < node.children.length; i++) {
                        //     //     console.log(i, node.children[i], tree.nodelist[node.children[i]].content);
                        //     // }
                        // }
                        // Now in any case predecessor equals '§'. 
                        // Number of § in leftpart+predecessor is one higher al old left_count
                        // left_count++;

                        if (exponent_or_subscript !== '§') {
                            new_node = create_node('leaf', exponent_or_subscript, tree);
                            new_node.parent = node.id;
                            node.children.splice(left_count, 0, new_node.id);
                            // for (var i = 0; i < node.children.length; i++) {
                            //     console.log(i, node.children[i], tree.nodelist[node.children[i]].content);
                            // }
                        }
                        node.content = leftpart + needle + '§' + rest;
                    }
                } else {
                    nextnode = true;
                }
            }
            while (nextnode == false)
        });
    }
}

function unify_sub_or_power(tree, power) {
    var needle = '_§';
    if (power) {
        needle = '^§';
    }
    tree.withEachLeaf(function (node) {
        var start = 0;
        var nextnode = false;
        do {
            // console.log('parsing ' + node.content + ' with ' + needle);
            var pos = node.content.indexOf(needle, start);
            if (pos < 0) {
                nextnode = true;
            } else {
                start = pos + 1;
                var leftpart = node.content.substring(0, pos - 1);
                var left_count = (leftpart.match(/§/g) || []).length;
                var base = node.content.substr(pos - 1, 1);
                var rest = node.content.substr(pos + 2);
                console.log(leftpart + ' | ' + base + needle + ' | ' + rest + ' left_count=' + left_count);
                if (base !== '§') {
                    new_node = create_node('leaf', base, tree);
                    new_node.parent = node.id;
                    node.children.splice(left_count, 0, new_node.id);
                }
                node.content = leftpart + '§' + needle + rest;
            }
        } while (nextnode == false)
    });
}

function unify_sub_power_backup(tree, power) {
    tree.withEachNode(function (node) {
        var needle = '_';
        if (power) {
            needle = '^';
        }
        var nextnode = false;
        var start = 0;
        do {
            if (node.type == 'leaf') {
                var pos = node.content.indexOf(needle, start);
                if (pos < 0) {
                    nextnode = true;
                } else {
                    start = pos + 1;
                    var leftpart = node.content.substring(0, pos - 1);
                    var left_count = (leftpart.match(/§/g) || []).length;
                    var rest = node.content.substr(pos + 2);
                    var predecessor = node.content.substr(pos - 1, 1);
                    var successor = node.content.substr(pos + 1, 1);
                    console.log(leftpart + ' | ' + predecessor + needle + successor + ' | ' + rest + 'left_count=' + left_count);

                    if (predecessor !== '§') {
                        new_node = create_node('leaf', predecessor, tree);
                        new_node.parent = node.id;
                        node.children.splice(left_count, 0, new_node.id);
                        // for (var i = 0; i < node.children.length; i++) {
                        //     console.log(i, node.children[i], tree.nodelist[node.children[i]].content);
                        // }
                    }
                    // Now in any case predecessor equals '§'. 
                    // Number of § in leftpart+predecessor is one higher al old left_count
                    left_count++;

                    if (successor !== '§') {
                        new_node = create_node('leaf', successor, tree);
                        new_node.parent = node.id;
                        node.children.splice(left_count, 0, new_node.id);
                        // for (var i = 0; i < node.children.length; i++) {
                        //     console.log(i, node.children[i], tree.nodelist[node.children[i]].content);
                        // }
                    }
                    var middlepart = '§' + needle + '§';
                    node.content = leftpart + middlepart + rest;
                }
            } else {
                nextnode = true;
            }
        }
        while (nextnode == false)
    });
}

function parse_sub_power(tree, power) {
    var needle = '§_§';
    var type = 'sub';
    if (power) {
        needle = '§^§';
        type = 'power';
    }
    tree.withEachLeaf(function (node) {
        var stop = false;
        var pos = -1;
        do {
            pos = node.content.indexOf(needle);
            if (pos > -1) {
                var leftpart = node.content.substring(0, pos);
                var middlepart = node.content.substr(pos, 3);
                var rest = node.content.substr(pos + 3);
                console.log('#>' + leftpart + ' | ' + middlepart + ' | ' + rest);
                var left_count = (leftpart.match(/§/g) || []).length; //same for ^ and _
                var base = tree.nodelist[node.children[left_count]];
                var exponent_or_subscript = tree.nodelist[node.children[left_count + 1]];
                if (!power) {
                    if (exponent_or_subscript.type.startsWith('bracket')) {
                        var child = tree.nodelist[exponent_or_subscript.children[0]];
                        if (child.type == 'leaf') {
                            child.type = 'text'; //avoid later "timification"
                        }
                    }
                }
                if (middlepart !== needle) {
                    console.log('Error in parse_sub_power: ' + needle + ' not found');
                }
                var new_node = create_node(type, '', tree);
                new_node.parent = node.id;
                node.children.splice(left_count, 2, new_node.id);
                node.content = leftpart + '§' + rest;
                new_node.children.push(base.id);
                base.parent = new_node.id;
                new_node.children.push(exponent_or_subscript.id);
                exponent_or_subscript.parent = new_node.id;
            } else {
                stop = true;
            }
        } while (stop === false);
    });
}

function parse_numbers(tree) {
    tree.withEachNode(function (node) {
        if (node.type == 'leaf') {
            var content = node.content;
            // console.log('number leaf ' + content);
            // var regex = '\\d+((\\.|\\,)\\d+)?';
            var regex = '(\\d+(\\.|\\,))?\\d+';
            // backslash must be masked: \\
            var pos = content.search(regex);
            if (pos == 0) {
                var match = content.match(regex);
                var num = content.substr(0, match[0].length);
                var rest = content.substring(match[0].length);
                node.content = "§" + rest;
                var number = create_node("number", num, tree);
                number.parent = node.id;
                node.children.splice(0, 0, number.id)
            }
        }
    })
}

function parse_factors(tree) {
    var i = 0;
    // length of tree.nodelist may change -> 
    // do not use "for", but "do-while"
    do {
        var node = tree.nodelist[i];
        if (node.type == 'leaf') {
            var content = node.content.trim();
            // console.log('factor leaf ' + content);
            if (content == "") {
                content = "?";
            }
            if (content.length == 1) {
                // console.log('nothing to do');
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
}

function parse_integral(tree) {
    // for (var i = 0; i < list_of_nodes.length; i++) {
    // does not fit because length of list changes
    tree.withEachLeaf(function (node) {
        content = node.content;
        var needle = '\\int_§^§';
        var pos = content.indexOf(needle);
        if (pos > -1) {
            console.log('int found at ' + content + ' pos= ' + pos);
            var left = node.content.substring(0, pos);
            var right = node.content.substring(pos + needle.length);
            var left_count = (left.match(/§/g) || []).length;
            var right_count = (right.match(/§/g) || []).length;
            // if there is no § in left, then left_count = 0
            console.log(' content=' + node.content + ' pos=' + pos);
            // console.log(' left=###' + left + '###' + ' right=###' + right + '###');
            var newcontent = left + '§';
            // node has one § less! 
            console.log('newcontent=' + newcontent);
            node.content = newcontent;
            //check
            var lower_bound = tree.nodelist[node.children[left_count]];
            var upper_bound = tree.nodelist[node.children[left_count + 1]];
            var integral = create_node('integral', '', tree);
            var integrand = create_node('leaf', right, tree);
            // link integral
            integral.parent = node.id;
            //integral has three children 
            integral.children = [lower_bound.id, upper_bound.id, integrand.id];
            // now the other directions
            lower_bound.parent = integral.id;
            upper_bound.parent = integral.id;
            integrand.parent = integral.id;
            node.children[left_count] = integral.id;
            node.children.splice(left_count + 1, 1);
            console.log('left_count=' + left_count);
            console.log('right_count=' + right_count);
            for (var i = left_count + 1; i <= left_count + right_count; i++) {
                var id = node.children[i];
                console.log('i=' + i + ' id=' + id);
                console.log(tree.nodelist[id]);
                integrand.children.push(id);
                tree.nodelist[id].parent = integrand.id;
            }
            console.log(node.children);
            node.children.splice(left_count + 1, right_count);
            console.log(node.children);
        }
    });
}

function parse_sqrt(tree) {
    parse_radix(tree, false);
}

function parse_nthroot(tree) {
    parse_radix(tree, true);
}

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
                        // console.log(test + ' should be bracket-[');
                        test = tree.nodelist[node.children[rad_index + 1]].type;
                        // console.log(test + ' should be bracket-{');
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
                        // console.log('new=' + newcontent);
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

function parse_log(tree) {
    tree.withEachLeaf(function (node) {
        content = node.content;
        var needle = '\\log_§';
        var pos = content.indexOf(needle);
        var stop = false;
        do {
            if (pos > -1) {
                console.log('log_§ found at ' + content + ' pos= ' + pos);
                var left = node.content.substring(0, pos);
                var right = node.content.substring(pos + needle.length);
                var left_count = (left.match(/§/g) || []).length;
                var right_count = (right.match(/§/g) || []).length;
                // if there is no § in left, then left_count = 0
                console.log(' content=' + node.content + ' pos=' + pos);
                // console.log(' left=###' + left + '###' + ' right=###' + right + '###');
                var newcontent = left + '§';
                // node has one § less! 
                console.log('newcontent=' + newcontent);
                node.content = newcontent;
                //check
                var base = tree.nodelist[node.children[left_count]];
                var log = create_node('fn-log', '', tree);
                var arg = create_node('leaf', right, tree);
                // link log
                log.parent = node.id;
                //log has two children 
                log.children = [base.id, arg.id];
                // now the other directions
                base.parent = log.id;
                arg.parent = log.id;
                node.children[left_count] = log.id;
                node.children.splice(left_count + 1, 1);
                console.log('left_count=' + left_count);
                // console.log('right_count=' + right_count);
                // for (var i = left_count + 1; i <= left_count + right_count; i++) {
                //     var id = node.children[i];
                //     console.log('i=' + i + ' id=' + id);
                //     console.log(tree.nodelist[id]);
                //     integrand.children.push(id);
                //     tree.nodelist[id].parent = integrand.id;
                // }
                // console.log(node.children);
                // node.children.splice(left_count + 1, right_count);
                // console.log(node.children);
            } else {
                stop = true;
            }

        } while (stop == false)
    });
}

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
}

// output to canvas
col = 0;

function paint_tree(tree, canvas, message) {
    var ctx = canvas.getContext("2d");
    col = "#ffffdf";
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke;
    ctx.font = '12pt Consolas';
    paint_tree_recurse(tree.root, tree.nodelist, -9999, -9999, 0, 0, ctx, 1);
    ctx.fillText(message, 20, 30);
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
        var curr = currentNode.type;
        if (curr.startsWith('bracket-')) {
            curr = curr.substring(8);
        }
        if (curr.startsWith('fu-')) {
            curr = curr.substring(3);
        }
        // if (curr == 'leaf') {
        //     curr = '';
        // }
        if (curr == 'plusminus') {
            curr = '+/-';
        }
        if (curr == 'number') {
            curr = 'num';
        }
        ctx.fillText(curr, xx + 2, yy);
        ctx.fillStyle = "#ff5050";
        ctx.fillText(currentNode.content, xx + 2, yy + 15);
    }
};

function paint_tree_recurse(currentNode, nodelist, xa, ya, x, y, ctx, factor) {
    paint_tree_callback(currentNode, xa, ya, x, y, ctx);
    var xa = x;
    var ya = y;
    // factor = factor * 0.75;
    factor = factor * 0.7;
    var cnchl = currentNode.children.length;
    for (var i = 0, length = cnchl; i < length; i++) {
        paint_tree_recurse(nodelist[currentNode.children[i]], nodelist, xa, ya, xa + factor * (i - 0.5 * (cnchl - 1)), y + 1, ctx, factor);
    }
};