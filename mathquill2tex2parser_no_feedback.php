<?php
$title = 'Test Page - MathQuill2Tex2Parser (no feedback)';
$liblist = "['mathquill', 'mathquillcss']";
include_once 'header.php';
?>

<script src="/js/lib/parse_brackets5.part1.js"></script>
<script src="/js/lib/parse_brackets5.part2.js"></script>

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \textcolor{blue}{\frac{km}{h}} </textarea>
  <hr>
  <textarea id="tree_out" rows="30" cols="80" style="width:80%;" readonly>tree</textarea>
 <hr>

  <script>

  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  })

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
        // no feedback latexSource -> mf
        // mf.latex(newtext);
        tree_output();
      }
    });
  });
 }

 function tree_output(){
   var myTree = new tree();
   myTree.leaf.content = latexSource.val();
   parse(myTree);
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

</script>

 <?php include_once 'footer.php'; ?>