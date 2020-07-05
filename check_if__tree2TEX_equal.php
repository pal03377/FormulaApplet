<?php $title = 'Check if equal';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>
<!-- check if tree2TEX(parsed tree) is same than given TEX string -->

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>
<script>
  function prepare_page() {
  var MQ = MathQuill.getInterface(2);
  var mathField = new Array();
  var out = '';
  var canvas = document.getElementById("treecanvas");
  var myTree = new tree();

  $(document).ready(function () {
    $(".tex-example").each(function () {
      var index = $(".tex-example").index(this);
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
    $( '.tex-example').each(function(){
      console.log(this.id);
      var selector = '#' + this.id+ ' .mq-textarea';
      $( selector ).append($('<img>',{id:this.id+'-img-wrong',src:'css/blitz.svg', width:25, height:50}));
    });
    $(".tex-example").click(function () {
      var index = $(".tex-example").index(this);
      editHandler(index);
      $(".tex-example").removeClass('selected');
      $(this).addClass('selected');
    });
    // button = $("#cont");
    // canvas.click(...) sucks
    var single_step = false;
    if (single_step){
      $( '#treecanvas' ).click( function(event){
        var temp = parsetree_by_index(myTree);
          var message = temp[0];
          end_parse = temp[1];
          paint_tree(myTree, canvas, message);
          if(end_parse){
              var dummy = value(myTree);
          }
      });
    } else {
      // one step
      $( '#treecanvas' ).click( function(event){
          parse(myTree);
          var tex = tree2TEX(myTree);
          message = 'end parse';
          paint_tree(myTree, canvas, message);
          //fillWithRandomValues(myTree);
          var dummy = value(myTree);
          console.log('value=' + dummy);
      });
    }
    $( '#check' ).click( function(event){
      console.log('check button clicked');
      $(".tex-example").each(function () {
        var index = $(".tex-example").index(this);
        mf = mathField[index];
        var tex_1 = mf.latex();
        tex_1 = deleteSpaceAndRemoveBackslash(tex_1);
        myTree = new tree();
        myTree.leaf.content = tex_1;
        parse(myTree);
        var tex_2 = tree2TEX(myTree);
        tex_2 = deleteSpaceAndRemoveBackslash(tex_2);

        var equal = (tex_1 == tex_2);
        if (equal){
          $(this).removeClass('isNotEqual').addClass('isEqual');
        } else {
          $(this).removeClass('isEqual').addClass('isNotEqual');
          console.log( tex_1 );
          console.log( tex_2 );
       }
      // var dummy = value(myTree);
      // $( "#out" ).text( dummy );
     });
    });

    // button.mouseup( function(){button.attr('data-clickstate', 'up')});
  });

    function editHandler(index) {
    mf = mathField[index];
    // var out = mf.latex();
    out = mf.latex();
     myTree = new tree();
     myTree.leaf.content = mf.latex();
    // parse(myTree);
    document.getElementById('output').innerHTML = out + '<br>' + value(myTree);
    // parsetree_init();
    parsetree_counter.setCounter(0);
    // test = tree2TEX(myTree);
    //                    var message = ' Error.';
    //                    if (out === test) {
    //                        message = ' OK.';
    //                    }
    //                    document.getElementById('ttt').innerHTML = test + message;
    paint_tree(myTree, canvas, 'start of parsing');
    // console.log( '*** list of unknown leafs ***');
    traverseSimple(
            function (node) {
              if (node.type == 'unknown leaf'){
                console.log(node.id + ' ' + node.content);
              }
            }, myTree.nodelist);
  }
}

waitfor_mathquill_and_if_ready_then_do(function () {
  prepare_page();
});

  // Parse from LaTeX ...
  const latexInput = '\\frac{1}{\\sqrt{2}}\\cdot x=10';
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/js/lib/tex-example.css";
  document.getElementsByTagName("head")[0].appendChild(link);

</script>
<link href="css/gf09.css" rel="stylesheet">
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>gf09</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="tex-example" id="unu683">3,5\textcolor{blue}{\frac{km}{h}}=\ 0,97\textcolor{blue}{\frac{m}{s}}</p><br />
        <p class="tex-example" id="inv862">3,5 \textcolor{blue}{kWh} = 12,6 \textcolor{blue}{MJ}</p><br />
        <!-- <p class="tex-example" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><img src="css/blitz.svg" alt="wrong" style="width:52px;height:52px;"><br /> -->
        <p class="tex-example" id="ser409">(7,2a - 3,4b)^2 = 51,84a^2-48,96ab + 11,56b^2</p><br />
        <p class="tex-example" id="con335">\frac{1}{u}-\frac{1}{v}=\frac{v-u}{uv}</p><br />
              
<canvas id="treecanvas" width="1200" height="600" style="
display: none;
border: 1px solid #000000;
position: fixed;
right: 30px;
top: 30px;
transform: scale(1.05);
background-color: #ffffdf !important;">
</canvas>


<?php include_once 'footer.php';?>