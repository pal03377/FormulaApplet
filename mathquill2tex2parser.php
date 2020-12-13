<?php
$title = 'Test Page - MathQuill2Tex2Parser';
$liblist = "['tex_parser', 'mathquill', 'mathquillcss']";
include_once 'header.php';
?>

<!-- <script src="./js/lib/tex_parser.js"></script> -->

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \textcolor{blue}{\frac{km}{h}} </textarea>
  <hr>
  <textarea id="tree_out" rows="30" cols="80" style="width:80%;" readonly>tree</textarea>
 <hr>

  <script>

  function init(){
    console.log( 'init' );
    var eMath = $('#editable-math')[0]; latexSource = $('#latex'), tree_out = $('#tree_out');
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
      if(newtext !== oldtext) {
        //latexSource -> mf
        mf.latex(newtext);
      }
    });
  });
 }

 function tree_output(){
   var myTree = parse(latexSource.val());
   var output = "";
   var indent = -1;
   var points = '.'.repeat(50);
   function prefix(node){
     indent++;
     // output += node.id + ' ' + points.substr(0, indent * 2) + node.type + ' ' + node.content + '\n';
     output += points.substr(0, indent * 2) + node.type + ' ' + node.content + '\n';
   }
   function callback(node){
     indent--;
    };
   traverseDepthFirstWithPrefix(prefix, callback,  myTree.nodelist);
   // output += greek_list();
   tree_out.val(output);
 }

 window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    waitfor_mathquill_and_if_ready_then_do( init );
 });

</script>

 <?php include_once 'footer.php'; ?>