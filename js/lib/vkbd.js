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

var keys_mixed = [
    // row 0
    [
        ['x'],
        ['y'],
        ['z'],
        ['pi', '&pi;', '\\pi'], ['smallgap-0', '', ''],
        ['7'],
        ['8'],
        ['9'],
        ['times', '&times;', '\\cdot'],
        ['divided', '&divide;', '/']
    ],
    // row 1
    [
        ['a'],
        ['b'],
        ['c'],
        ['nth_root', 'svg', '\\nthroot'], ['smallgap-1', '', ''],
        ['4'],
        ['5'],
        ['6'],
        ['plus', '+', '+'],
        ['minus', '-', '-']
    ],
    // row 2
    [
        ['a'],
        ['b'],
        ['c'],
        ['nth_root', 'svg', '\\nthroot'], ['smallgap-2', '', ''],
        ['1'],
        ['2'],
        ['3'],
        ['equal', '=', '='],
        ['backspace', '&#xf55a;', 'cmd-backspace']
    ],
]

function create_vkbd(key_array) {
    var result='<table>\r\n';
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
            if(key[0].startsWith('smallgap')){
                cl += ' smallgap';
            }
            result += '<td class="' + cl + '" id="vkbd-' + key[0] + '" cmd="';
            result += key[2] + '">' + key[1] + '</td>\r\n';
            // console.log('vkbd-' + key[0] + ' ' + key[1] + ' cmd-' + key[2]);
        }
        result += '</tr>\r\n';
        // console.log(row);
    }
    result += '</table>\r\n';
    return result;
}

var vkbdLoaded = true;