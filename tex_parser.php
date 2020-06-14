<?php $title = 'TEX Parser';
$liblist = "[ 'mathquill', 'mathquillcss' ]";
include_once 'header.php';
?>

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
    $(".tex-example").click(function () {
      var index = $(".tex-example").index(this);
      editHandler(index);
      $(".tex-example").removeClass('selected');
      $(this).addClass('selected');
    });
    // button = $("#cont");
    // canvas.click(...) sucks
    // $( '#treecanvas' ).click( function(event){
    //     var temp = parsetree_by_index(myTree);
    //     var message = temp[0];
    //     end_parse = temp[1];
    //     paint_tree(myTree, canvas, message);
    //     if(end_parse){
    //         inspect_tree(myTree);
    //     }
    // });
    $( '#treecanvas' ).click( function(event){
        parse(myTree);
        var tex = tree2TEX(myTree);
        message = 'end parse';
        paint_tree(myTree, canvas, message);
        //fillWithRandomValues(myTree);
        var dummy = value(myTree);
    });
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
       // inspect_tree(myTree);
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
    document.getElementById('output').innerHTML = out + '<br>';
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
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>TEX Parser</h2>

        <p id="output">output</p>
        <p><button id="check">Check all</button></p>
        <!-- p id="version">version</p -->
        <p class="tex-example">3,5\textcolor{blue}{\frac{km}{min}}+0,045\textcolor{blue}{\frac{cm^3}{s^2}}</p><br />
        <p class="tex-example">5,6^3ab^5(p+q)rs^e \cdot 2vw^{\left(n-2\right)}\ \cdot\ \Gamma^\alpha</p><br />
        <p class="tex-example">5,7y_n+rs_{n+2}-z_{\max}^8</p><br />
        <p class="tex-example">5,7y^n+rs^{n+2}-z_{\max}^{t-8}</p><br />
        <p class="tex-example">\sqrt{2}</p><br />
        <p class="tex-example">\sin x+5\cosh\left(x\right)+\tan xy+\sin^2\beta-\sin^{2+n}3\alpha</p><br />
        <p class="tex-example">\lim_{x\to\infty}\frac{4x}{7-5x^2}</p><br />
        <p class="tex-example">\ln x+5\exp\left(x\right)+\log xy+\lg\beta-\log_{2+n}3\alpha+log_749</p><br />
        <p class="tex-example">3,4+5\sqrt{a^2+b^2}-(y+5)\sqrt{x+4}</p><br />
        <p class="tex-example">\sqrt[3]2</p><br />
        <p class="tex-example">\sqrt[7]{x+3y}</p><br />
        <p class="tex-example">\left(2a+5b\right)-7c+11d-12\left(6x+3y\right)+\left(21x-33y\right)</p><br />
        <p class="tex-example">2^{\frac{3}{2}}+\frac{3+x}{4+x}</p><br />
        <p class="tex-example">\int_a^b\sin\left(x\right)dx</p><br />
        <p class="tex-example">\int\left(x^3-\frac{7}{5}x\right)dx</p><br />
        <p class="tex-example">\int_{1,5}^{4,8}\frac{y}{y+2}dy</p><br />
        <p class="tex-example">3a + 5\int_{a+1}^{b+2}z^7dz</p><br />
        <p class="tex-example">\int_{a-7}^b\frac{dt}{4+t^2}</p><br />
        <p class="tex-example">d-e</p><br />
        <p class="tex-example">7^{\frac{3}{2}}</p><br />
        <p class="tex-example">\left(\frac{7-y^2}{11+y^3}\right)^{n_i+1,5}</p><br />
        <p class="tex-example">15+\left[3,5 \cdot ab+\left(2a-3b\right)\left(3a+5b\right)\right]</p><br />
        <p class="tex-example">78x_{\min}-\left\{99 \cdot x_{\max}+\left(\frac{x_{\alpha}}{x_{\beta}+x_{\gamma}}\right)\right\}</p><br />
        <hr />
<canvas id="treecanvas" width="1200" height="600" style="
border: 1px solid #000000;
position: fixed;
right: 30px;
top: 30px;
transform: scale(1.05);
background-color: #ffffdf !important;">
</canvas>


<?php include_once 'footer.php';?>