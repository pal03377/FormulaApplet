// tree_canvas.js
console.log('Here is tree_canvas.js');
// output to canvas

function paint_tree(tree, canvas, message) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffdf";
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke;
    ctx.font = '12pt Consolas';
    paint_tree_recurse(tree.root, tree.nodelist, -9999, -9999, 0, 0, ctx, 1, tree);
    ctx.fillText(message, 20, 30);
};

function paint_tree_callback(currentNode, xa, ya, x, y, ctx, tree) {
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
        if (isInUnit(tree, currentNode)) {
            // curr += '(U)';
            ctx.fillStyle = "#e050e0";
        }
        ctx.fillText(curr, xx + 2, yy);
        ctx.fillStyle = "#ff5050";
        ctx.fillText(currentNode.content, xx + 2, yy + 15);
    }
};

function paint_tree_recurse(currentNode, nodelist, xa, ya, x, y, ctx, factor, tree) {
    paint_tree_callback(currentNode, xa, ya, x, y, ctx, tree);
    var xa = x;
    var ya = y;
    // factor = factor * 0.75;
    factor = factor * 0.7;
    var cnchl = currentNode.children.length;
    for (var i = 0, length = cnchl; i < length; i++) {
        paint_tree_recurse(nodelist[currentNode.children[i]], nodelist, xa, ya, xa + factor * (i - 0.5 * (cnchl - 1)), y + 1, ctx, factor, tree);
    }
};

function canvasclick_singlestep(){
    var parse_result = parsetree_by_index(myTree);
    var message = parse_result.message;
    console.log(message);
    end_parse = parse_result.end_parse;
    paint_tree(myTree, tree_canv, message);
    // console.log('***' + message);
    //  for(var i=0; i <7; i++){
    //   console.log('node ' + i + ': ' + myTree.nodelist[i].type + ' ' + myTree.nodelist[i].content);
    // }
    if(end_parse){
        fillWithValues(myTree, true, []);
        var hasValue = myTree.hasValue;
        paint_tree(myTree, tree_canv, 'filWithRandomValues');
      if (hasValue){
          var dummy = val(myTree.root, myTree);
      } else {
          console.log('tree not evaluable');
      }
    }
  }
  
  function canvasclick_quick(){
    console.log('canvasclick_quick');
    do{
        var parse_result = parsetree_by_index(myTree);
        var end_parse = parse_result.end_parse;
    } while (end_parse == false)
    // var tex = tree2TEX(myTree);
    message = 'end parse';
    paint_tree(myTree, tree_canv, message);
    //fillWithValues(myTree, true, []);
    var dummy = value(myTree);
  }
  
