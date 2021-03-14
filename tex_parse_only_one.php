<?php $title = 'TEX Parser (only one)';
$liblist = "[ 'tex_parser', 'mathquill', 'mathquillcss', 'gf09css']";
include_once 'header.php';
?>

<script>
  function prepare_page() {
  var MQ = MathQuill.getInterface(2);
  var mathField = new Array();
  var out = '';
  var canvas = document.getElementById("treecanvas");
  var myTree = new tree();

  $(document).ready(function () {
    $(".formula_applet").each(function () {
      var index = $(".formula_applet").index(this);
      // console.log(index);
      mf = MQ.MathField(this, {
        handlers: {
          edit: function () {
            editHandler(index);
          }
        }
      });
      mathField.push(mf);
    });
    $(".formula_applet").click(function () {
      var index = $(".formula_applet").index(this);
      editHandler(index);
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
    });
    // button = $("#cont");
    // canvas.click(...) sucks
    var single_step = true;
    if (single_step){
      $( '#treecanvas' ).click( function(event){
        var parse_result = parsetree_by_index(myTree);
          var message = parse_result.message;
          end_parse = parse_result.end_parse;
          paint_tree(myTree, canvas, message);
          // console.log('***' + message);
          //  for(var i=0; i <7; i++){
          //   console.log('node ' + i + ': ' + myTree.nodelist[i].type + ' ' + myTree.nodelist[i].content);
          // }
          if(end_parse){
              fillWithValues(myTree, true, []);
              var hasValue = myTree.hasValue;
              paint_tree(myTree, canvas, 'filWithRandomValues');
            if (hasValue){
                var dummy = val(myTree.root, myTree);
            } else {
                console.log('tree not evaluable');
            }
          }
      });
    } else {
      // one step
      $( '#treecanvas' ).click( function(event){
          do{
            var parse_result = parsetree_by_index(myTree);
            var end_parse = parse_result.end_parse;
          } while (end_parse == false)
          var tex = tree2TEX(myTree);
          message = 'end parse';
          paint_tree(myTree, canvas, message);
          //fillWithValues(myTree, true, []);
          var dummy = value(myTree);
      });
    }
  });

    function editHandler(index) {
    mf = mathField[index];
    // var out = mf.latex();
    out = mf.latex();
     myTree = new tree();
     myTree.leaf.content = mf.latex();
    document.getElementById('output').innerHTML = out + '<br>';
    parsetree_counter.setCounter(0);
    paint_tree(myTree, canvas, 'start of parsing');
    traverseSimple(
            function (node) {
              if (node.type == 'unknown leaf'){
                // console.log(node.id + ' ' + node.content);
              }
            }, myTree.nodelist);
  }
}

// waitfor_mathquill_and_if_ready_then_do(function () {
prepare_page();
// });

</script>
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>TEX Parser</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <p class="formula_applet">\sqrt{2}</p><br />
            <hr />
<canvas id="treecanvas" width="400" height="500" style="
border: 1px solid #000000;
position: relative ;
right: 30px;
top: 30px;
transform: scale(1.05);
background-color: #ffffdf !important;">
</canvas>

<?php include_once 'uses.php';?>
<?php include_once 'footer.php';?>