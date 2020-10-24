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

var smallgap = ['smallgap', '', ''];

var keys_mixed = [
    // row 1
    [
        ['x'],
        ['y'],
        ['z'],
        ['pi', '&pi;', '\\pi'], smallgap,
        ['7'],
        ['8'],
        ['9'],
        ['times', '&times;', '\\cdot'],
        ['divided', '&divide;', '/']
    ],
    // row 2
    [
        ['a'],
        ['b'],
        ['c'],
        ['nth_root', 'svg', '\\nthroot'], smallgap,
        ['4'],
        ['5'],
        ['6'],
        ['plus', '+', '+'],
        ['minus', '-', '-']
    ],
    // row 3
    [
        ['a'],
        ['b'],
        ['c'],
        ['nth_root', 'svg', '\\nthroot'], smallgap,
        ['1'],
        ['2'],
        ['3'],
        ['equal', '=', '='],
        ['backspace', '&#xf55a;', 'cmd-backspace']
    ],
]

function create_vkbd(key_array) {
    for (var rows = 0; rows < key_array.length - 1; rows++) {
        var row = key_array[rows];
        for (var keyindex = 0; keyindex < row.length - 1; keyindex++) {
            var key = row[keyindex];
            if (typeof key[1] == 'undefined') {
                key[1] = key[0];
            }
            if (typeof key[2] == 'undefined') {
                key[2] = key[0];
            }
            console.log('vkbd-' + key[0] + ' ' + key[1] + ' cmd-' + key[2]);
        }
        // console.log(row);
    }
}

var vkbd_keys_mixed = create_vkbd(keys_mixed);