<?php
$title = 'Test Page - MathQuill2Tex2tree';
$liblist = "['mathquill', 'mathquillcss']";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \textcolor{blue}{\frac{km}{h}} </textarea>
  <hr>
  <textarea id="tree2TEX" style="width:80%;vertical-align:top" class="tex-example">tex2</textarea>
  <canvas id="treecanvas" width="1200" height="600" style="
border: 1px solid #000000;
position: fixed;
right: 30px;
top: 30px;
transform: scale(1.05);
background-color: #ffffdf !important;">
</canvas>

  <script>

  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  })

  function init(){
    console.log( 'init' );
    var eMath = $('#editable-math')[0]; latexSource = $('#latex'), tree2tex = $('#tree2TEX');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
        edit: function(){
          //mf -> latexSource
        latexSource.val(mf.latex());
        tree_output();
      }
    }});
    mf.latex(latexSource.val());

    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
       //delete spaces
       newtext = newtext.replace(/\\\s/g, '');
      if(newtext !== oldtext) {
        //latexSource -> mf
        mf.latex(newtext);
      }
    });
  });
}
var canvas = document.getElementById("treecanvas");

function tree_output(){
   var myTree = new tree();
   myTree.leaf.content = latexSource.val();
   parse(myTree);
   paint_tree(myTree, canvas, 'TEX tree');
   var tex_1 = latexSource.val();
   var tex_2 = tree2TEX(myTree);
   tree2tex.val(tex_2);
   var temp = tex_1.replace(/\\cdot/g, '\\cdot ');
   tex_1 = temp.replace(/\\cdot  /g, '\\cdot ');
   var temp = tex_2.replace(/\\cdot/g, '\\cdot ');
   tex_2 = temp.replace(/\\cdot  /g, '\\cdot ');
   var equal = (tex_1 == tex_2);
    if (equal){
        $(tree2tex).removeClass('isNotEqual').addClass('isEqual');
    } else {
        $(tree2tex).removeClass('isEqual').addClass('isNotEqual');
    }

  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/js/lib/tex-example.css";
  document.getElementsByTagName("head")[0].appendChild(link);

 }

</script>

 <?php include_once 'footer.php';?>