"use strict"; 
// not needed for actual lib?

export function tree2TEX(tree) {
    var depth = 0;
    return recurse(tree.root);

    function recurse(node) {
        var numberOfChildren = (node.children || []).length;
        depth ++;
        var res = [];
        for (var i = 0; i < numberOfChildren; i++) {
            var child = tree.nodelist[node.children[i]];
            res[i] = recurse(child);
        }

        var done = false;
        var result = '';
        if (numberOfChildren === 0) {
            // leaf, num, text
            if (node.type.startsWith('greek')) {
                result = '\\' + node.content;
            } else {
                result = node.content;
            }
            done = true;
        }
        if (numberOfChildren === 1) {
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
            if (node.type.startsWith('unit')) {
                result = '\\textcolor{blue}{';
                result += node.content;
                result += '}';
                result += res[0];
                done = true;
            }
            if (node.type.startsWith('fu-')) {
                result = '\\';
                result += node.type.substr(3);
                var child = tree.nodelist[node.children[0]];
                // \tanxy -> \tan xy
                var insert_space = true;
                if (child.type.startsWith('bracket')) {
                    insert_space = false
                };
                if (child.content.startsWith(' ')) {
                    insert_space = false
                };
                if (child.type.startsWith('greek')) {
                    insert_space = false
                };
                if (insert_space) {
                    result += ' ';
                }
                result += res[0];
                done = true;
            }
            if (!done) {
                result = res[0];
            }
        }
        if (numberOfChildren >= 2) {
            if (node.type.startsWith('plusminus') || node.type.startsWith('timesdivided') || node.type.startsWith('*')) {
                result = res[0];
                result += node.content;
                result += res[1];
                if (node.type.startsWith('timesdivided')) {
                    var temp = result.replace(/\\cdot/g, '\\cdot ');
                    result = temp.replace(/\\cdot  /g, '\\cdot ');
                }
                done = true;
            }
            if ((!done) && node.type.startsWith('frac')) {
                result = '\\frac';
                result += res[0];
                result += res[1];
                done = true;
            }
            if ((!done) && node.type.startsWith('sub')) {
                result = res[0];
                result += '_';
                result += res[1];
                done = true;
            }
            if ((!done) && node.type.startsWith('power')) {
                result = res[0];
                result += '^';
                result += res[1];
                done = true;
            }
            if ((!done) && node.type.startsWith('fu-') && node.content.startsWith('power')) {
                var fu = node.type.substr(3);
                result = '\\' + fu + '^';
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
            if ((!done) && node.type.startsWith('fu-log')) {
                result = '\\log_';
                result += res[0];
                result += res[1];
                done = true;
            }
            if (node.type.startsWith('fu-lim')) {
                result = '\\lim_';
                result += res[0];
                result += res[1];
                done = true;
            }
            if (node.type.startsWith('integral')) {
                result = '\\int_';
                result += res[0];
                result += '^';
                result += res[1];
                result += res[2];
                var r3 = res[3];
                if (typeof (r3) !== 'undefined') {
                    result += r3;
                }
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
                    var left = temp.substring(0, pos);
                    var right = temp.substring(pos + 1);
                    var middle = res[count];
                    temp = left;
                    temp += middle;
                    temp += right;
                    count ++;
                }
            } while (pos > -1)
            result = temp;
        }
        depth --;
        return result;
    }
}