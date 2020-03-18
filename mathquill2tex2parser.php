<?php
  $title='Test Page - MathQuill2Tex2Parser';
  $liblist = "['mathquill', 'mathquillcss']";
  include_once( 'header.php' );
?>

<body>
  <p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \textcolor{blue}{\frac{km}{h}} </textarea>
   <p>Algebrite: </p>
  <textarea id="output" name="terminal" rows="4" cols="80" style="width:100%;"></textarea>
  <hr>
  <pre id="tree">empty</pre>
  <hr>
  
  <script>
  // TODO: put these waiting functions into glue.js
  
  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  }) 
 
  function init(){
    console.log( 'init' );
    var eMath = $('#editable-math')[0]; latexSource = $('#latex'), tree = $('#tree');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
      edit: function(){
        // console.log(mf.latex());
        latexSource.val(mf.latex());
        MathText.text(mf.text());
        parse();
      }
    }});
    mf.latex(latexSource.val());

    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        console.log(newtext);
        mf.latex(newtext);
        //mf.reflow();
      }
    });
  });
 }
 
 function parse(){
   console.log(latexSource);
 }
      
 }
</script>

 <?php include_once( 'footer.php' ); ?>