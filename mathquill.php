<?php $title='Test Page - MathQuill (gf09)';
  $liblist = "['mathquill', 'mathquillcss' ]";
  include_once( 'header.php' );
?>

<body>
<h1><?php echo $title; ?></h1>
<p>MathQuill: <span id="editable-math"></span></p>
 <textarea id="latex" style="width:80%;vertical-align:top">\frac{d}{dx}\sqrt{x} = 3,5 \textcolor{blue}{\frac{km}{h}} </textarea>
 
<script>
  waitfor_libLoader_and_if_ready_then_do( function() {
      waitfor_mathquill_and_if_ready_then_do( init );
  }) 
 
  function init(){
    console.log( 'init' );
    var eMath = $('#editable-math')[0]; latexSource = $('#latex');
    var MQ = MathQuill.getInterface(2);
    mf = MQ.MathField(eMath, {handlers:{
      edit: function(){
        latexSource.val(mf.latex());
      }
    }});
 
    latexSource.bind('keydown keypress', function() {
    var oldtext = latexSource.val();
    setTimeout(function() {
      var newtext = latexSource.val();
      if(newtext !== oldtext) {
        console.log(newtext);
        mf.latex(newtext);
       }
    });
  });

  mf.latex(latexSource.val());
 }
</script>

 <?php include_once( 'footer.php' ); ?>