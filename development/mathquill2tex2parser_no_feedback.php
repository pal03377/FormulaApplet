<?php
$title = 'Test Page - MathQuill2Tex2Parser (no feedback)';
$liblist = "['tex_parser', 'mathquill', 'mathquillcss', 'translate']";
$prefix="../"; 
include_once( $prefix . 'header.php' );
?>

<!-- <script src="./js/lib/tex_parser.js"></script> -->

<body>
<!--
  <p>MathQuill: <span id="editable-math"></span></p>
  -->
  <textarea id="latex" style="width:90%;vertical-align:top">\sin(3\delta)</textarea>
  <hr>
  <textarea id="tree_out" rows="30" cols="80" style="width:90%;" readonly>tree</textarea>
 <hr>

  <script>

  function init(){
    console.log( 'init' );
    initTranslation();
    var eMath = $('#editable-math')[0]; latexSource = $('#latex'), tree_out = $('#tree_out');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
        edit: function(){
          //mf -> latexSource
        latexSource.val(mf.latex());
        tree_output();
      }
    }});
    // mf.latex(latexSource.val());

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
   var ls = latexSource.val();
   ls = ls.replace(/\\unit{/g, '\\textcolor{blue}{');
   var myTree =  parse(ls);
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

//  window.addEventListener('DOMContentLoaded', (event) => {
//     console.log('DOM fully loaded and parsed');
//     // waitfor_mathquill_and_if_ready_then_do( init );
//     init();
//  });
</script>

<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>